const getColorPreference = () => {
  if (localStorage.getItem('theme-preference'))
    return localStorage.getItem('theme-preference')
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
}

const setPreference = (theme) => {
  localStorage.setItem('theme-preference', theme)
  document.firstElementChild
    .setAttribute('color-theme', theme)
}


window.onload = () => {
  document.firstElementChild
    .setAttribute('color-theme', getColorPreference())

  document
    .querySelector('#theme-switch')
    .addEventListener('click', () => {
      let theme = getColorPreference() === 'light'
        ? 'dark'
        : 'light'

      setPreference(theme)
    })
}