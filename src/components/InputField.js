'use client';

/**
 * InputField — standardised input with optional left icon and right element.
 *
 * Usage:
 *   <InputField label="Email" icon={Mail} type="email" placeholder="you@example.com" />
 *   <InputField label="Password" icon={Lock} rightEl={<EyeToggle />} type="password" />
 *   <InputField label="Amount" icon={DollarSign} type="number" inputCls="text-lg font-bold" />
 */
export default function InputField({
  label,
  icon: Icon,
  rightEl,
  error,
  hint,
  wrapCls = '',
  inputCls = '',
  ...inputProps
}) {
  return (
    <div className={wrapCls}>
      {label && (
        <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider font-medium">
          {label}
        </label>
      )}
      <div className="input-wrap">
        {Icon && (
          <span className="input-icon-left">
            <Icon size={16} />
          </span>
        )}
        <input
          {...inputProps}
          className={[
            'input-dark w-full',
            Icon    ? 'pl-11' : '',
            rightEl ? 'pr-12' : '',
            inputCls,
          ].filter(Boolean).join(' ')}
        />
        {rightEl && (
          <span className="input-icon-right">
            {rightEl}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-gtb-danger text-xs flex items-center gap-1">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-gtb-muted text-xs">{hint}</p>
      )}
    </div>
  );
}
