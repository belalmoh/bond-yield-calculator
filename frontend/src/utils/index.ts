export const cn = (...classes: (string | boolean)[]) => {
    return classes.filter(Boolean).join(' ');
}