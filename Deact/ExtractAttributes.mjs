const valueIndex = (pattern, string) => {
    let start = string.indexOf(pattern)
    let end = string.indexOf(pattern, start+1)
    return [start, end]
}

let findClosingParenthesis = (arr) => {
    let counter = 0;
  let index = 0;
    for(index in arr){
      if(arr[index][0] == 'open'){
        counter++;
      } else {
        counter--;
      }
      if(counter===0){
        break;
      }    
    }
    return arr[index][1];
}

const getEndIndexOfBrackets = (s) => {
  const ansArr = [];
  s.split("").forEach((char, index) => {
    if (char === "{") ansArr.push(["open", index]);
    if (char === "}") ansArr.push(["closed", index]);
  })
  return findClosingParenthesis(ansArr);
}

const getEndIndexOfQuotes = (s, quote) => {
  const ansArr = [];
  s.split("").forEach((char, index) => {
    if (char === quote) ansArr.push(index);
  })
  return ansArr[1];
}

const getEndOfValueIndex = (string) => {
  if(string.trim().startsWith("{")){
      let endIndex = getEndIndexOfBrackets(string);
      return [1, endIndex]
    } else if(string.trim().startsWith("'")){
        return [1, getEndIndexOfQuotes(string, "'")]
    } else if(string.startsWith('"')){
      return [1, getEndIndexOfQuotes(string, '"')]
    } else {
        let end = string.indexOf("\s")
        if(end == -1){
            end = string.length
        }
      return [0, end];
    }
}

const extract = (s) => {
  let attributes = [];
  let index = 0;

  let rest = s;

  while(index<rest.length){
    let indexOfKeyValueSeparator = rest.indexOf("=")
    if(indexOfKeyValueSeparator > 1){
      let key = rest.slice(0, indexOfKeyValueSeparator).trim()
      rest = rest.slice(indexOfKeyValueSeparator+1).trim()

      let valueEndIndices = getEndOfValueIndex(rest) 
      let value = rest.slice(valueEndIndices[0], valueEndIndices[1])
 
      rest = rest.slice(valueEndIndices[1]+1).trim()
      
      index = valueEndIndices[1]
      attributes.push({
        key: key,
        value: value
      })

    } else {
      break;
    }
  }
  return attributes
}


// console.log(extract('className="hello"'))
// console.log(extract('className=5'))
// console.log(extract('onClick ={() => {console.log("hello")}} onClick ={() => console.log("hello")}'))
// console.log(extract('onClick={() => setState({eventCount: state.eventCount+1})}'))