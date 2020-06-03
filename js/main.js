const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

/*
//Before imperative development
const attrsToString = (obj = {}) => {
  const keys = Object.keys(obj)
  //console.log(keys)
  const attrs = []

  for (let i = 0; i < keys.length; i++) {
    const attr = keys[i];
    attrs.push(`${attr}="${obj[attr]}" `)
  }

  const string = attrs.join('')

  return string
}
*/

//After declarative development
const attrsToString = (obj = {}) =>
  Object.keys(obj)
    .map(attr => `${attr}="${obj[attr]}"`)
    .join(' ')

//Closure
const tagAttrs = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' :	 ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

/*
//Before imperative development
const tag = t => {
  if(typeof t === 'string') {
    return tagAttrs({ tag: t })
  }
  return tagAttrs(t)
}
*/

//After declarative development
const tag = t => typeof t === 'string' ? tagAttrs({ tag: t }) : tagAttrs(t) //Operator ternary

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')
const tableRowTag = tag('tr')
//const tableRows = items => tableRowTag(tableCells(items))
const tableRows = items => compose(tableRowTag, tableCells)(items)
const trashIcon = tag({tag: 'i', attrs: {
  class: 'fas fa-trash-alt'
}})('')

let description = $('#description')
let calories = $('#calories')
let carbs = $('#carbs')
let protein = $('#protein')
let list = []

const validateInputs = () => {
  description.val() ? '' : description.addClass('is-invalid')
  calories.val() ? '' : calories.addClass('is-invalid')
  carbs.val() ? '' : carbs.addClass('is-invalid')
  protein.val() ? '' : protein.addClass('is-invalid')

  if(
    description.val() &&
    calories.val() &&
    carbs.val() &&
    protein.val()
  ) add()
}

description.keypress(() => {
  description.removeClass('is-invalid')
})

calories.keypress(() => {
  calories.removeClass('is-invalid')
})

carbs.keypress(() => {
  carbs.removeClass('is-invalid')
})

protein.keypress(() => {
  protein.removeClass('is-invalid')
})

const add = () =>{
  const newItem = {
    description: description.val(),
    calories: parseInt(calories.val()),
    carbs: parseInt(carbs.val()),
    protein: parseInt(protein.val())
  }

  list.push(newItem)
  renderItems()
  cleanInputs()
  updateTotals()
}

const updateTotals = () =>{
  let calories = 0, carbs = 0, protein = 0

  list.map(item =>{
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  })

  $('#totalCalories').text(calories)
  $('#totalCarbs').text(carbs)
  $('#totalProtein').text(protein)

}

const renderItems = () => {
  $('tbody').empty()

  list.map((item, index) => {
    const removeBtn = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon)

    $('tbody').append(tableRows([
      item.description,
      item.calories,
      item.carbs,
      item.protein,
      removeBtn
    ]))
  })
}

const removeItem = (index) => {
  list.splice(index, 1)
  renderItems()
  updateTotals()
}

const cleanInputs = () =>{
  description.val('')
  calories.val('') 
  carbs.val('')
  protein.val('') 
}
