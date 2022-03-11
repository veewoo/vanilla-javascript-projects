// Create function to convert given string to the output below

// Input
const optionRule =
  "{1069} AND ({1070} OR {1071} OR {1072}) AND {1244} AND ({1245} OR {1339})";

// Output Example
/* const output = {
  and: [
    1069,
    { or: [1070, 1071, 1072] },
    1244,
    { or: [1245, 1339] },
  ]
}; */

let result = "result";

function getResult(optionRule) {
  console.log(optionRule);
  let result = {};
  let items = optionRule.split(" ");
  let key = "";
  let index = 0;

  while (Object.keys(result).length === 0) {
    key = items[index].toLowerCase();
    if (key === "and" || key === "or") {
      result[key] = [];
    }
    index++;
  }

  while (items.length) {
    let item = items.shift();

    if (item[0] === "{") {
      result[key].push(parseInt(item.substring(1, item.length - 1)));
    } else if (item[0] == "(") {
      result[key].push(getResult(getSubObject(item, items)));
    }
  }

  return result;
}

function getSubObject(firstElement, arr) {
  let result = firstElement;
  while (result[result.length - 1] !== ")") {
    result += " " + arr.shift();
  }
  return result.substring(1, result.length - 1);
}

console.log("result:", getResult(optionRule));
