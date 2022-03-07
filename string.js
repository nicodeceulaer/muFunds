// source: https://www.tutorialstonight.com/javascript-string-format.php#:~:text=Formatting%20string%20in%20javascript%20is,a%20dollar%20sign%20(%24).&text=These%20variables%20are%20called%20placeholders,the%20values%20of%20the%20variables.

String.prototype.format = function () {
  // store arguments in an array
  var args = arguments;
  // use replace to iterate over the string
  // select the match and check if related argument is present
  // if yes, replace the match with the argument
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    // check if the argument is present
    return typeof args[index] == 'undefined' ? match : args[index];
  });
};
