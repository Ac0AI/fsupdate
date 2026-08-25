import { Control, FieldValues, UseFormSetValue } from 'react-hook-form'

type UseFromHelpers<T extends FieldValues> = {
  setValueHelper: UseFormSetValue<T>
}

export const useFormHelpers = <T extends FieldValues>(control: Control<T, object>, setValue: UseFormSetValue<T>): UseFromHelpers<T> => {
  const setValueHelper: UseFormSetValue<T> = (name, value, options) => {
    /**
     * This access internals of react-hook-form.
     * There might be a better way of doing this without accessing the internals
     * as they might change in the future.
     */
    const field = control._fields[name] as { _f?: { ref?: unknown } } | undefined
    const ref = field?._f?.ref

    if (!ref) {
      return
    }

    const input = ref as HTMLElement
    if (input.tagName === 'INPUT') {
      if (value) {
        input.classList.add('has-value')
      } else {
        input.classList.remove('has-value')
      }
    }

    return setValue(name, value, options)
  }
  return { setValueHelper }
}
