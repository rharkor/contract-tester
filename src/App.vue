<template>
  <router-view />
</template>

<script>
export default {};
</script>


<style lang="sass">
:root
  --black: #06283D
  --blue: #1363DF
  --blue-100: #1363DF
  --blue-50: #47B5FF
  --blue-0: #DFF6FF

#app
  height: 100vh
  overflow: hidden
  background-color: var(--black)
  color: var(--blue-0)
  font-family: 'Poppins', sans-serif

input
  &:focus
    border: none
    box-shadow: 0 0 0 0.25rem rgb(var(--blue) / 25%)

*
  margin: 0
  padding: 0
</style>
