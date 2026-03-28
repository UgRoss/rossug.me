---
title: 'JavaScript Advanced Default Parameters'
pubDate: '2019-01-31'
category: 'JavaScript'
---

Parameters defined to the left are available as default values for later parameters.

```javascript
function displayModal(title, closeButtonText = `Close ${title}`) {
  console.log(closeButtonText)
}

displayModal('Shopping Cart') // Close Shopping Cart
displayModal('Shopping Cart', 'Close') // Close
```

You can also call functions as default values:

```javascript
function getFullPrice(price) {
  return price * 1.15
}

function getValue(price, pricePlusTax = getFullPrice(price)) {
  console.log(price.toFixed(2), pricePlusTax.toFixed(2))
}

getValue(22) // 22.00 25.30
getValue(67) // 67.00 77.05
```
