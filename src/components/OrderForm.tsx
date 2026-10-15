import { useEffect, useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { flavors, quantitySelectId, type Flavor } from '../data/flavors';
import { useMotion } from '../motion/context';
import Arrow from './ui/Arrow';
import Magnet from './ui/Magnet';

// Web3Forms access key, injected at build time from the VITE_WEB3FORMS_KEY
// Actions secret (see .github/workflows/deploy.yml). Set it in .env.local to
// submit from a dev build.
const WEB3FORMS_KEY: string = import.meta.env.VITE_WEB3FORMS_KEY ?? '';
const ENDPOINT = 'https://api.web3forms.com/submit';
const INSTAGRAM_URL = 'https://www.instagram.com/impeccablecookieco/';

// "" is "none". Units are an open owner question, so the list stays as it was.
const QUANTITIES = ['1', '2', '3', '4', '5', '6', '6+', '12', '24', 'Bulk Order'];
// The owner's inbox reads these names in the `order` field: keep them as they were.
const ORDER_NAMES: Record<Flavor['id'], string> = {
  'chocolate-chip': 'Chocolate Chip',
  snickerdoodle: 'Snickerdoodle',
};
const CONTACT_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'call_phone', label: 'Call' },
  { value: 'text_phone', label: 'Text' },
];
// The payload carries the label, not the value.
const FULFILLMENT = [
  { value: 'pickup', label: 'Pickup' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'shipping', label: 'Shipping to a Michigan address' },
];

type Values = {
  name: string;
  email: string;
  phone: string;
  quantities: Record<Flavor['id'], string>;
  communication: string;
  fulfillment: string;
  michigan: boolean;
  notes: string;
};

type FieldKey = 'name' | 'email' | 'phone' | 'flavors' | 'communication' | 'fulfillment' | 'michigan';
type Errors = Partial<Record<FieldKey, string>>;
type Alert = { kind: 'invalid'; fields: string[] } | { kind: 'unavailable' } | { kind: 'failed' } | null;

const EMPTY: Values = {
  name: '',
  email: '',
  phone: '',
  quantities: { 'chocolate-chip': '', snickerdoodle: '' },
  communication: '',
  fulfillment: '',
  michigan: false,
  notes: '',
};

// Page order: the summary lists fields in this order and focus goes to the first.
const FIELDS: { key: FieldKey; label: string; focusId: string }[] = [
  { key: 'name', label: 'Name', focusId: 'name' },
  { key: 'email', label: 'Email', focusId: 'email' },
  { key: 'phone', label: 'Phone', focusId: 'phone' },
  { key: 'flavors', label: 'Cookies', focusId: quantitySelectId(flavors[0].id) },
  { key: 'communication', label: 'Best way to reach you', focusId: 'contact-email' },
  { key: 'fulfillment', label: 'How to get your cookies', focusId: 'fulfillment-pickup' },
  { key: 'michigan', label: 'Michigan confirmation', focusId: 'michigan' },
];

// The email check is the browser's own type="email" rule, read through the constraint
// validation API, plus a dot in the domain (type="email" accepts name@example): the form
// is noValidate so every error uses the same inline pattern.
const emailOk = (value: string, el: HTMLInputElement | null) =>
  !el?.validity.typeMismatch && /@[^@]+\.[^@.]+$/.test(value.trim());
// Ten digits once punctuation and a leading country code 1 are dropped.
const phoneOk = (value: string) => value.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '').length === 10;

function validate(values: Values, email: HTMLInputElement | null): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Enter your name.';
  if (!values.email.trim()) errors.email = 'Enter your email address.';
  else if (!emailOk(values.email, email)) errors.email = 'Enter an email address like name@example.com.';
  if (!values.phone.trim()) errors.phone = 'Enter your phone number.';
  else if (!phoneOk(values.phone)) errors.phone = 'Enter a 10-digit phone number with area code.';
  if (!Object.values(values.quantities).some(Boolean)) errors.flavors = 'Choose a quantity for at least one cookie.';
  if (!values.communication) errors.communication = 'Choose the best way to reach you.';
  if (!values.fulfillment) errors.fulfillment = 'Choose pickup, delivery or shipping.';
  if (!values.michigan) errors.michigan = 'Please confirm your order is within Michigan. I sell within Michigan only.';
  return errors;
}

const listFields = (labels: string[]) =>
  labels.length > 1 ? `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}` : labels[0];

const ids = (...list: (string | false | undefined)[]) => list.filter(Boolean).join(' ') || undefined;

export function InstagramLink() {
  return (
    <a className="link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
      @impeccablecookieco<span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field__error">
      {message}
    </p>
  );
}

export default function OrderForm() {
  const { scrollToSection } = useMotion();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState<Alert>(null);
  // Bumped on every announcement so a repeated message is re-read by screen readers.
  const [attempt, setAttempt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  // False in the prerendered HTML and on the first client render, so Send stays disabled
  // until React owns the form: without JS a native submit would drop the order.
  const [hydrated, setHydrated] = useState(false);
  // Read synchronously, so two submits in the same task cannot both reach fetch.
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const botRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Adopt anything typed into the prerendered form before React took over: the
  // re-render that enables Send would otherwise reset every controlled field to EMPTY.
  useEffect(() => {
    const form = formRef.current;
    if (form) {
      const value = (id: string) =>
        form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`#${id}`)?.value ?? '';
      const picked = (name: string) => form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? '';
      setValues({
        name: value('name'),
        email: value('email'),
        phone: value('phone'),
        quantities: {
          'chocolate-chip': value(quantitySelectId('chocolate-chip')),
          snickerdoodle: value(quantitySelectId('snickerdoodle')),
        },
        communication: picked('communication'),
        fulfillment: picked('fulfillment'),
        michigan: form.querySelector<HTMLInputElement>('#michigan')?.checked ?? false,
        notes: value('notes'),
      });
    }
    setHydrated(true);
  }, []);

  // The success panel replaces the form: bring the pad back under the header and move
  // focus to the panel so its message is read.
  useEffect(() => {
    if (!sent) return;
    scrollToSection('order', { focus: false });
    successRef.current?.focus({ preventScroll: true });
  }, [sent, scrollToSection]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));

  const clearError = (key: FieldKey) => {
    if (!errors[key]) return;
    const next = { ...errors };
    delete next[key];
    setErrors(next);
    if (alert?.kind === 'invalid' && Object.keys(next).length === 0) setAlert(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;

    const found = validate(values, emailRef.current);
    const invalid = FIELDS.filter((f) => found[f.key]);
    if (invalid.length) {
      // Render aria-invalid and the messages before focus lands, so the field is read
      // with its error.
      flushSync(() => {
        setErrors(found);
        setAlert({ kind: 'invalid', fields: invalid.map((f) => f.label) });
        setAttempt((n) => n + 1);
      });
      document.getElementById(invalid[0].focusId)?.focus();
      return;
    }
    setErrors({});

    if (!WEB3FORMS_KEY) {
      console.error('Order form is not configured: VITE_WEB3FORMS_KEY is missing from this build.');
      setAlert({ kind: 'unavailable' });
      setAttempt((n) => n + 1);
      return;
    }

    setAlert(null);
    setSubmitting(true);

    const order = flavors
      .filter((f) => values.quantities[f.id])
      .map((f) => `${ORDER_NAMES[f.id]} (${values.quantities[f.id]})`)
      .join(', ');
    const fulfillment = FULFILLMENT.find((f) => f.value === values.fulfillment)?.label ?? values.fulfillment;

    try {
      inFlight.current = true;
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Cookie Order from ${values.name.trim()}`,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          order,
          preferred_communication: values.communication,
          fulfillment,
          michigan: 'Yes',
          notes: values.notes.trim() || 'None',
          // Web3Forms honeypot: sent only when ticked, as a native form post would.
          ...(botRef.current?.checked ? { botcheck: true } : {}),
        }),
      });

      const result: { success?: boolean; message?: string } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? 'Submission failed');
      }

      setValues(EMPTY);
      setSent(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      flushSync(() => {
        setSubmitting(false);
        setAlert({ kind: 'failed' });
        setAttempt((n) => n + 1);
      });
      // The disabled button dropped focus (to <body>, or in Safari to <main>); give keyboard
      // users their place back unless they have moved to another field.
      if (!formRef.current?.contains(document.activeElement)) submitRef.current?.focus();
    } finally {
      inFlight.current = false;
    }
  };

  if (sent) {
    return (
      <div ref={successRef} className="order-success" role="status" tabIndex={-1}>
        <svg className="order-success__icon" viewBox="0 0 52 52" aria-hidden="true" focusable="false">
          <circle className="order-success__ring" cx="26" cy="26" r="24" />
          <path className="order-success__tick success-check" pathLength="1" d="M15 27.5l7.5 7.5L37.5 19" />
        </svg>
        <p className="order-success__text">
          <span className="order-success__title">Thank you. I received your order request.</span>{' '}
          It isn&apos;t confirmed yet. I&apos;ll contact you by your preferred method to confirm the details, and before
          you pay you&apos;re welcome to meet me in person or on a video call.{' '}
          <span className="order-success__pay">
            Once your order is confirmed, pay by Venmo to @impeccablecookie. I sell within Michigan only.
          </span>
        </p>
      </div>
    );
  }

  const invalid = (key: FieldKey) => (errors[key] ? true : undefined);

  // autoComplete="off" on the form stops Firefox restoring the button's last enabled state
  // on reload, before hydration; name, email and phone keep their own autofill tokens.
  return (
    <form
      ref={formRef}
      className="order-form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      aria-describedby="order-required"
    >
      <p id="order-required" className="order-form__required">
        All fields are required unless marked optional.
      </p>

      <div className="order-form__contact">
        <div className="field field--name">
          <label className="field__label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="field__control"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            value={values.name}
            aria-invalid={invalid('name')}
            aria-describedby={ids(errors.name && 'name-error')}
            onChange={(e) => {
              set('name', e.target.value);
              if (e.target.value.trim()) clearError('name');
            }}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="email">
            Email
          </label>
          <input
            ref={emailRef}
            id="email"
            className="field__control"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={values.email}
            aria-invalid={invalid('email')}
            aria-describedby={ids(errors.email && 'email-error')}
            onChange={(e) => {
              set('email', e.target.value);
              if (emailOk(e.target.value, e.target)) clearError('email');
            }}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            className="field__control"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 555-0123"
            required
            value={values.phone}
            aria-invalid={invalid('phone')}
            aria-describedby={ids(errors.phone && 'phone-error')}
            onChange={(e) => {
              set('phone', e.target.value);
              if (phoneOk(e.target.value)) clearError('phone');
            }}
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>
      </div>

      <fieldset className="order-form__group">
        <legend className="field__label">Cookies (choose at least one)</legend>
        <div className="order-form__flavors">
          {flavors.map((flavor) => (
            <div className="field" key={flavor.id}>
              <label className="field__label field__label--sub" htmlFor={quantitySelectId(flavor.id)}>
                {flavor.name}
              </label>
              <select
                id={quantitySelectId(flavor.id)}
                className="field__control field__control--select"
                value={values.quantities[flavor.id]}
                aria-invalid={invalid('flavors')}
                aria-describedby={ids(errors.flavors && 'flavors-error', 'order-personal-use')}
                onChange={(e) => {
                  const quantities = { ...values.quantities, [flavor.id]: e.target.value };
                  set('quantities', quantities);
                  if (Object.values(quantities).some(Boolean)) clearError('flavors');
                }}
              >
                <option value="">Select quantity</option>
                {QUANTITIES.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <FieldError id="flavors-error" message={errors.flavors} />
        <p id="order-personal-use" className="order-form__note">
          Orders are for personal use and gifting. I don&apos;t sell for resale or wholesale.
        </p>
      </fieldset>

      <fieldset className="order-form__group">
        <legend className="field__label">Best way to reach you</legend>
        <div className={errors.communication ? 'choices choices--invalid' : 'choices'}>
          {CONTACT_METHODS.map((method) => (
            <label className="choice" key={method.value} htmlFor={`contact-${method.value}`}>
              <input
                id={`contact-${method.value}`}
                className="choice__input"
                type="radio"
                name="communication"
                value={method.value}
                required
                checked={values.communication === method.value}
                aria-invalid={invalid('communication')}
                aria-describedby={ids(errors.communication && 'communication-error')}
                onChange={(e) => {
                  set('communication', e.target.value);
                  clearError('communication');
                }}
              />
              {method.label}
            </label>
          ))}
        </div>
        <FieldError id="communication-error" message={errors.communication} />
      </fieldset>

      <fieldset className="order-form__group">
        <legend className="field__label">How would you like to get your cookies?</legend>
        <div className={errors.fulfillment ? 'choices choices--invalid' : 'choices'}>
          {FULFILLMENT.map((option) => (
            <label className="choice" key={option.value} htmlFor={`fulfillment-${option.value}`}>
              <input
                id={`fulfillment-${option.value}`}
                className="choice__input"
                type="radio"
                name="fulfillment"
                value={option.value}
                required
                checked={values.fulfillment === option.value}
                aria-invalid={invalid('fulfillment')}
                aria-describedby={ids(errors.fulfillment && 'fulfillment-error')}
                onChange={(e) => {
                  set('fulfillment', e.target.value);
                  clearError('fulfillment');
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError id="fulfillment-error" message={errors.fulfillment} />
      </fieldset>

      <div className="order-form__group">
        <label className={errors.michigan ? 'check-row check-row--invalid' : 'check-row'} htmlFor="michigan">
          <input
            id="michigan"
            className="check-row__input"
            type="checkbox"
            required
            checked={values.michigan}
            aria-invalid={invalid('michigan')}
            aria-describedby={ids(errors.michigan && 'michigan-error')}
            onChange={(e) => {
              set('michigan', e.target.checked);
              if (e.target.checked) clearError('michigan');
            }}
          />
          <span>I&apos;m in Michigan, and this order will be picked up, delivered or shipped within Michigan.</span>
        </label>
        <FieldError id="michigan-error" message={errors.michigan} />
      </div>

      <div className="field order-form__group">
        <label className="field__label" htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          className="field__control field__control--area"
          rows={4}
          placeholder="Anything I should know?"
          value={values.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </div>

      {/* Honeypot: people never see or reach it; form-filling bots tick it. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="botcheck">Leave this box unchecked</label>
        <input ref={botRef} id="botcheck" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="order-form__alert" role="alert">
        {alert?.kind === 'invalid' && (
          <p key={attempt}>
            Please check {alert.fields.length === 1 ? 'this field' : `these ${alert.fields.length} fields`}:{' '}
            {listFields(alert.fields)}.
          </p>
        )}
        {alert?.kind === 'unavailable' && (
          <p key={attempt}>
            Online ordering is temporarily unavailable. Please message me on Instagram at <InstagramLink /> to place
            your order.
          </p>
        )}
        {alert?.kind === 'failed' && (
          <p key={attempt}>
            Something went wrong sending your request. Please try again, or message me on Instagram at{' '}
            <InstagramLink />.
          </p>
        )}
      </div>

      <div className="order-form__foot">
        <Magnet>
          <button
            ref={submitRef}
            type="submit"
            className="pill pill--primary order-form__submit"
            disabled={!hydrated || submitting}
            data-sending={submitting || undefined}
          >
            {submitting ? 'Sending...' : 'Send order request'}
            {!submitting && <Arrow className="pill__arrow" />}
          </button>
        </Magnet>
        <p className="order-form__fine">Nothing is charged here. I confirm first, then you pay by Venmo.</p>
        {/* Prerendered, removed once React owns the form; order.css shows it only if that
            has not happened after 4s (a stalled or failed script). */}
        {!hydrated && (
          <p className="order-form__fine order-form__stalled">
            The order form is still loading. If Send doesn&apos;t respond, email{' '}
            <a className="link" href="mailto:hello@impeccablecookie.com">
              hello@impeccablecookie.com
            </a>{' '}
            or message me on Instagram at <InstagramLink />.
          </p>
        )}
        <noscript>
          <p className="order-form__fine">
            Online ordering needs JavaScript. Email{' '}
            <a className="link" href="mailto:hello@impeccablecookie.com">
              hello@impeccablecookie.com
            </a>{' '}
            or message me on Instagram at <InstagramLink />.
          </p>
        </noscript>
      </div>
      <p className="order-form__notice">
        Made in a home kitchen that has not been inspected by the Michigan Department of Agriculture and Rural
        Development.
      </p>
    </form>
  );
}
