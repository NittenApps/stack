export function evalStringExpression(expression: string, argNames: string[]): any {
  try {
    return Function(...argNames, `return ${expression};`) as any;
  } catch (error) {
    console.error(expression, error);
  }
}

export function evalExpression(expression: string | Function | boolean, thisArg: any, argVal: any[]): any {
  if (typeof expression === 'function') {
    return expression.apply(thisArg, argVal);
  } else {
    return expression ? true : false;
  }
}
