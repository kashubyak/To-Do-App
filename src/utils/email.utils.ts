export const encodeEmail = (email: string): string => email.replace(/\./g, '_DOT_')
export const decodeEmail = (safeEmail: string): string => safeEmail.replace(/_DOT_/g, '.')
