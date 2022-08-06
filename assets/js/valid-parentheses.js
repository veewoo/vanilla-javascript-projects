/*

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.
 

Example 1:

Input: s = "()"
Output: true
Example 2:

Input: s = "()[]{}"
Output: true
Example 3:

Input: s = "(]"
Output: false
 

Constraints:

1 <= s.length <= 104
s consists of parentheses only '()[]{}'.

*/

const BRACKETS = {
  "(": ")",
  "{": "}",
  "[": "]",
};

console.log(isValid("()"));
console.log(isValid("()[]{}"));
console.log(isValid("(]"));
console.log(isValid("([{([{([{}])}])}])([{}])([{}])"));
console.log(isValid("([([{{}])])"));
console.log(isValid("[{}([])]"));
console.log(isValid("{}([])([{}])[([{}])"));

function isValid(str = "") {
  const stack = [];

  for (let i = 0; i < str.length; i++) {
    if (isOpenBracket(str[i])) {
      stack.push(str[i]);
    } else {
      const lastItem = stack.pop();
      if (!lastItem || BRACKETS[lastItem] !== str[i]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

function isOpenBracket(char) {
  return char === "(" || char === "{" || char === "[";
}
