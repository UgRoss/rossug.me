---
title: 'Object.freeze()'
pubDate: '2020-12-10'
category: 'JavaScript'
---

Freezes an object, preventing any changes - you can't add, edit, or delete properties. The object's prototype is also locked.

Attempts to modify a frozen object fail silently in normal mode, or throw a `TypeError` in strict mode.

```javascript
const person = {
  firstName: 'John',
  age: 19
}

Object.freeze(person)

person.firstName = 'Bob' // silently fails
delete person.age // silently fails
person.lastName = 'Smith' // silently fails

console.log(person) // { firstName: 'John', age: 19 }
```

Note that `Object.freeze()` is **shallow** - nested objects are not frozen:

```javascript
const obj = { nested: { value: 1 } }
Object.freeze(obj)

obj.nested.value = 99 // this works!
console.log(obj.nested.value) // 99
```
