export interface DateParts {
  day: string
  month: string
  year: string
}

const sanitizeDatePart = (value: string, maxLength: number): string =>
  value.replace(/\D/g, '').slice(0, maxLength)

const createEmptyDateParts = (): DateParts => ({ day: '', month: '', year: '' })

const splitIsoDateToParts = (value?: string): DateParts => {
  const formatted = value ? value.slice(0, 10) : ''

  if (!formatted || formatted.length < 10) {
    return createEmptyDateParts()
  }

  const [year, month, day] = formatted.split('-')

  return {
    day: day ?? '',
    month: month ?? '',
    year: year ?? '',
  }
}

const isDatePartsComplete = (parts: DateParts): boolean =>
  parts.day.length === 2 && parts.month.length === 2 && parts.year.length === 4

const hasAnyDateParts = (parts: DateParts): boolean =>
  parts.day.length > 0 || parts.month.length > 0 || parts.year.length > 0

const buildIsoDateFromParts = (parts: DateParts): string | null => {
  if (!isDatePartsComplete(parts)) {
    return null
  }

  const day = Number(parts.day)
  const month = Number(parts.month)
  const year = Number(parts.year)

  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return null
  }

  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) {
    return null
  }

  const date = new Date(year, month - 1, day)

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return `${parts.year}-${parts.month}-${parts.day}`
}

interface DatePartsInputProps {
  label: string
  dayId: string
  monthId: string
  yearId: string
  parts: DateParts
  disabled: boolean
  inputClassName: string
  labelClassName: string
  onChange: (part: keyof DateParts, value: string) => void
}

const DatePartsInput = ({
  label,
  dayId,
  monthId,
  yearId,
  parts,
  disabled,
  inputClassName,
  labelClassName,
  onChange,
}: DatePartsInputProps) => (
  <div>
    <p className={labelClassName}>{label}</p>
    <div className="grid grid-cols-3 gap-2">
      <input
        id={dayId}
        inputMode="numeric"
        autoComplete="off"
        className={inputClassName}
        placeholder="DD"
        value={parts.day}
        onChange={(event) => onChange('day', sanitizeDatePart(event.target.value, 2))}
        disabled={disabled}
      />
      <input
        id={monthId}
        inputMode="numeric"
        autoComplete="off"
        className={inputClassName}
        placeholder="MM"
        value={parts.month}
        onChange={(event) => onChange('month', sanitizeDatePart(event.target.value, 2))}
        disabled={disabled}
      />
      <input
        id={yearId}
        inputMode="numeric"
        autoComplete="off"
        className={inputClassName}
        placeholder="YYYY"
        value={parts.year}
        onChange={(event) => onChange('year', sanitizeDatePart(event.target.value, 4))}
        disabled={disabled}
      />
    </div>
  </div>
)

export {
  DatePartsInput,
  buildIsoDateFromParts,
  createEmptyDateParts,
  hasAnyDateParts,
  isDatePartsComplete,
  splitIsoDateToParts,
}
