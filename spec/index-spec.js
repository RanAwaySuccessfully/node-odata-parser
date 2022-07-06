const parser = require("../lib");

function expectToBe(actual, expected) {
    expect(actual).toBe(expected);
}
function expectOk(value) {
    expect(value).toBeTruthy();
}

describe('odata.parser grammar', () => {

    it('should parse $top and return the value', () => {

        var ast = parser.parse('$top=40');

        expectToBe(ast.$top, 40);
    });

    it('should parse two params', () => {

        var ast = parser.parse('$top=4&$skip=5');

        expectToBe(ast.$top, 4);
        expectToBe(ast.$skip, 5);
    });


    it('should parse three params', () => {

        var ast = parser.parse('$top=4&$skip=5&$select=Rating');

        expectToBe(ast.$top, 4);
        expectToBe(ast.$skip, 5);
        expectToBe(ast.$select[0], "Rating");
    });

    it('should parse string params', () => {

        var ast = parser.parse('$select=Rating');

        expectToBe(ast.$select[0], 'Rating');
    });

    it('should accept * in $select', () => {

        var ast = parser.parse('$select=*');

        expectToBe(ast.$select[0], '*');
    });

    it('should accept * and , and / in $select', () => {

        var ast = parser.parse('$select=*,Category/Name');

        expectToBe(ast.$select[0], '*');
        expectToBe(ast.$select[1], 'Category/Name');
    });

    it('should accept more than two fields', () => {

        var ast = parser.parse('$select=Rating, Name,LastName');

        expectToBe(ast.$select[0], 'Rating');
        expectToBe(ast.$select[1], 'Name');
        expectToBe(ast.$select[2], 'LastName');
    });

    // This select parameter is not currently supported.
    it('should accept * after . in $select', () => {

        var ast = parser.parse('$select=DemoService.*');

        expectToBe(ast.$select[0], 'DemoService.*');
    });

    it('should accept single-char field in $select', () => {

        var ast = parser.parse('$select=r');

        expectToBe(ast.$select[0], 'r');
    });
    
    it('should parse order by', () => {

        var ast = parser.parse('$orderby=ReleaseDate desc, Rating');

        expectToBe(ast.$orderby[0].ReleaseDate, 'desc');
        expectToBe(ast.$orderby[1].Rating, 'asc');

    });

    it('should parse $filter', () => {

        var ast = parser.parse("$filter=Name eq 'Jef'");

        expectToBe(ast.$filter.type, "eq");
        expectToBe(ast.$filter.left.type, "property");
        expectToBe(ast.$filter.left.name, "Name");
        expectToBe(ast.$filter.right.type, "literal");
        expectToBe(ast.$filter.right.value, "Jef");
    });
    
    it('should parse $filter containing quote', () => {
	var ast = parser.parse("$filter=Name eq 'O''Neil'");

	expectToBe(ast.$filter.type, "eq");
	expectToBe(ast.$filter.left.type, "property");
	expectToBe(ast.$filter.left.name, "Name");
	expectToBe(ast.$filter.right.type, "literal");
	expectToBe(ast.$filter.right.value, "O'Neil");
    });

    it('should parse $filter with subproperty', () => {
	var ast = parser.parse("$filter=User/Name eq 'Jef'");
	expectToBe(ast.$filter.type, "eq");
	expectToBe(ast.$filter.left.type, "property");
	expectToBe(ast.$filter.left.name, "User/Name");
	expectToBe(ast.$filter.right.type, "literal");
	expectToBe(ast.$filter.right.value, "Jef");
    });
    
    it('should parse $filter containing quote', () => {

      var ast = parser.parse("$filter=Name eq 'O''Neil'");

      expectToBe(ast.$filter.type, "eq");
      expectToBe(ast.$filter.left.type, "property");
      expectToBe(ast.$filter.left.name, "Name");
      expectToBe(ast.$filter.right.type, "literal");
      expectToBe(ast.$filter.right.value, "O'Neil");
  });

    it('should parse $filter with subproperty', () => {
	var ast = parser.parse("$filter=User/Name eq 'Jef'");
	expectToBe(ast.$filter.type, "eq");
	expectToBe(ast.$filter.left.type, "property");
	expectToBe(ast.$filter.left.name, "User/Name");
	expectToBe(ast.$filter.right.type, "literal");
	expectToBe(ast.$filter.right.value, "Jef");
    });
    
    it('should parse multiple conditions in a $filter', () => {

        var ast = parser.parse("$filter=Name eq 'John' and LastName lt 'Doe'");

        expectToBe(ast.$filter.type, "and");
        expectToBe(ast.$filter.left.type, "eq");
        expectToBe(ast.$filter.left.left.type, "property");
        expectToBe(ast.$filter.left.left.name, "Name");
        expectToBe(ast.$filter.left.right.type, "literal");
        expectToBe(ast.$filter.left.right.value, "John");
        expectToBe(ast.$filter.right.type, "lt");
        expectToBe(ast.$filter.right.left.type, "property");
        expectToBe(ast.$filter.right.left.name, "LastName");
        expectToBe(ast.$filter.right.right.type, "literal");
        expectToBe(ast.$filter.right.right.value, "Doe");
    });

    it('should parse multiple complex conditions in a $filter', () => {

        var ast = parser.parse("$filter=Name eq 'John' and (LastName lt 'Doe' or LastName gt 'Aro')");

        expectToBe(ast.$filter.type, "and");
        expectToBe(ast.$filter.left.type, "eq");
        expectToBe(ast.$filter.left.left.type, "property");
        expectToBe(ast.$filter.left.left.name, "Name");
        expectToBe(ast.$filter.left.right.type, "literal");
        expectToBe(ast.$filter.left.right.value, "John");
        expectToBe(ast.$filter.right.type, "or");
        expectToBe(ast.$filter.right.left.type, "lt");
        expectToBe(ast.$filter.right.left.left.name, "LastName");
        expectToBe(ast.$filter.right.left.right.type, "literal");
        expectToBe(ast.$filter.right.left.right.value, "Doe");
        expectToBe(ast.$filter.right.right.type, "gt");
        expectToBe(ast.$filter.right.right.left.name, "LastName");
        expectToBe(ast.$filter.right.right.right.type, "literal");
        expectToBe(ast.$filter.right.right.right.value, "Aro");
    });

    it('should parse substringof $filter', () => {

        var ast = parser.parse("$filter=substringof('nginx', Data)");

        expectToBe(ast.$filter.type, "functioncall");
        expectToBe(ast.$filter.func, "substringof");

        expectToBe(ast.$filter.args[0].type, "literal");
        expectToBe(ast.$filter.args[0].value, "nginx");

        expectToBe(ast.$filter.args[1].type, "property");
        expectToBe(ast.$filter.args[1].name, "Data");

    });

    it('should parse substringof $filter with empty string', () => {

        var ast = parser.parse("$filter=substringof('', Data)");

        expectToBe(ast.$filter.args[0].type, "literal");
        expectToBe(ast.$filter.args[0].value, "");

    });

    it('should parse substringof $filter with string containing quote', () => {

      var ast = parser.parse("$filter=substringof('ng''inx', Data)");
      expectToBe(ast.$filter.args[0].type, "literal");
      expectToBe(ast.$filter.args[0].value, "ng'inx");

    });
    
    it('should parse substringof $filter with string starting with quote', () => {

      var ast = parser.parse("$filter=substringof('''nginx', Data)");
      
      expectToBe(ast.$filter.args[0].type, "literal");
      expectToBe(ast.$filter.args[0].value, "'nginx");

    });
    
    it('should parse substringof $filter with string ending with quote', () => {

      var ast = parser.parse("$filter=substringof('nginx''', Data)");
      
      expectToBe(ast.$filter.args[0].type, "literal");
      expectToBe(ast.$filter.args[0].value, "nginx'");

    });

    it('should parse substringof eq true in $filter', () => {

        var ast = parser.parse("$filter=substringof('nginx', Data) eq true");

        expectToBe(ast.$filter.type, "eq");


        expectToBe(ast.$filter.left.type, "functioncall");
        expectToBe(ast.$filter.left.func, "substringof");
        expectToBe(ast.$filter.left.args[0].type, "literal");
        expectToBe(ast.$filter.left.args[0].value, "nginx");
        expectToBe(ast.$filter.left.args[1].type, "property");
        expectToBe(ast.$filter.left.args[1].name, "Data");

        expectToBe(ast.$filter.right.type, "literal");
        expectToBe(ast.$filter.right.value, true);
    });

    it('should parse startswith $filter', () => {

        var ast = parser.parse("$filter=startswith('nginx', Data)");

        expectToBe(ast.$filter.type, "functioncall");
        expectToBe(ast.$filter.func, "startswith");

        expectToBe(ast.$filter.args[0].type, "literal");
        expectToBe(ast.$filter.args[0].value, "nginx");

        expectToBe(ast.$filter.args[1].type, "property");
        expectToBe(ast.$filter.args[1].name, "Data");

    });

    ['tolower', 'toupper', 'trim'].forEach(function (func) {
      it('should parse ' + func + ' $filter', () => {
          var ast = parser.parse("$filter=" + func + "(value) eq 'test'");

          expectToBe(ast.$filter.type, "eq");

          expectToBe(ast.$filter.left.type, "functioncall");
          expectToBe(ast.$filter.left.func, func);
          expectToBe(ast.$filter.left.args[0].type, "property");
          expectToBe(ast.$filter.left.args[0].name, "value");

          expectToBe(ast.$filter.right.type, "literal");
          expectToBe(ast.$filter.right.value, "test");
      });
    });

    ['year', 'month', 'day', 'hour', 'minute', 'second'].forEach(function (func) {
      it('should parse ' + func + ' $filter', () => {
        var ast = parser.parse("$filter=" + func + "(value) gt 0");

          expectToBe(ast.$filter.type, "gt");

          expectToBe(ast.$filter.left.type, "functioncall");
          expectToBe(ast.$filter.left.func, func);
          expectToBe(ast.$filter.left.args[0].type, "property");
          expectToBe(ast.$filter.left.args[0].name, "value");

          expectToBe(ast.$filter.right.type, "literal");
          expectToBe(ast.$filter.right.value, 0);
      });
    });

    it('should parse year datetimeoffset $filter', () => {
        var ast = parser.parse("$filter=my_year lt year(datetimeoffset'2016-01-01T01:01:01Z')");

        expectToBe(ast.$filter.type, "lt");

        expectToBe(ast.$filter.left.type, "property");
        expectToBe(ast.$filter.left.name, "my_year");

        expectToBe(ast.$filter.right.type, "functioncall");
        expectToBe(ast.$filter.right.func, "year");
        expectToBe(ast.$filter.right.args[0].type, "literal");
        expectOk(ast.$filter.right.args[0].value instanceof Date);
    });

    ['indexof', 'concat', 'substring', 'replace'].forEach(function (func) {
      it('should parse ' + func + ' $filter', () => {
        var ast = parser.parse("$filter=" + func + "('haystack', needle) eq 'test'");

        expectToBe(ast.$filter.type, "eq");

        expectToBe(ast.$filter.left.type, "functioncall");
        expectToBe(ast.$filter.left.func, func);
        expectToBe(ast.$filter.left.args[0].type, "literal");
        expectToBe(ast.$filter.left.args[0].value, "haystack");
        expectToBe(ast.$filter.left.args[1].type, "property");
        expectToBe(ast.$filter.left.args[1].name, "needle");

        expectToBe(ast.$filter.right.type, "literal");
        expectToBe(ast.$filter.right.value, "test");
      });
    });

    ['substring', 'replace'].forEach(function (func) {
      it('should parse ' + func + ' $filter with 3 args', () => {
        var ast = parser.parse("$filter=" + func + "('haystack', needle, foo) eq 'test'");

        expectToBe(ast.$filter.type, "eq");

        expectToBe(ast.$filter.left.type, "functioncall");
        expectToBe(ast.$filter.left.func, func);
        expectToBe(ast.$filter.left.args[0].type, "literal");
        expectToBe(ast.$filter.left.args[0].value, "haystack");
        expectToBe(ast.$filter.left.args[1].type, "property");
        expectToBe(ast.$filter.left.args[1].name, "needle");
        expectToBe(ast.$filter.left.args[2].type, "property");
        expectToBe(ast.$filter.left.args[2].name, "foo");

        expectToBe(ast.$filter.right.type, "literal");
        expectToBe(ast.$filter.right.value, "test");
      });
    });

    it('should return an error if invalid value', () => {

        var ast = parser.parse("$top=foo");

        expectToBe(ast.error, "invalid $top parameter");
    });


    it('should convert dates to javascript Date', () => {
        var ast = parser.parse("$top=2&$filter=Date gt datetime'2012-09-27T21:12:59'");
        expectOk(ast.$filter.right.value instanceof Date);
    });

    it('should parse boolean okay', () => {
        var ast = parser.parse('$filter=status eq true');
        expectToBe(ast.$filter.right.value, true);
        var ast = parser.parse('$filter=status eq false');
        expectToBe(ast.$filter.right.value, false);
    });

    it('should parse numbers okay', () => {
        var ast = parser.parse('$filter=status eq 3');
        expectToBe(ast.$filter.right.value, 3);
        // Test multiple digits - problem of not joining digits to array
        ast = parser.parse('$filter=status eq 34');
        expectToBe(ast.$filter.right.value, 34);
        // Test number starting with 1 - problem of boolean rule order
        ast = parser.parse('$filter=status eq 12');
        expectToBe(ast.$filter.right.value, 12);
    });

    it('should parse negative numbers okay', () => {
        var ast = parser.parse('$filter=status eq -3');
        expectToBe(ast.$filter.right.value, -3);
        ast = parser.parse('$filter=status eq -34');
        expectToBe(ast.$filter.right.value, -34);
    });

    it('should parse decimal numbers okay', () => {
        var ast = parser.parse('$filter=status eq 3.4');
        expectToBe(ast.$filter.right.value, '3.4');
        ast = parser.parse('$filter=status eq -3.4');
        expectToBe(ast.$filter.right.value, '-3.4');
    });

    it('should parse double numbers okay', () => {
        var ast = parser.parse('$filter=status eq 3.4e1');
        expectToBe(ast.$filter.right.value, '3.4e1');
        ast = parser.parse('$filter=status eq -3.4e-1');
        expectToBe(ast.$filter.right.value, '-3.4e-1');
    });

    it('should parse $expand and return an array of identifier paths', () => {
        var ast = parser.parse('$expand=Category,Products/Suppliers');
        expectToBe(ast.$expand[0], 'Category');
        expectToBe(ast.$expand[1], 'Products/Suppliers');
    });

    it('should allow only valid values for $inlinecount', () => {
        var ast = parser.parse('$inlinecount=allpages');
        expectToBe(ast.$inlinecount, 'allpages');

        ast = parser.parse('$inlinecount=none');
        expectToBe(ast.$inlinecount, 'none');

        ast = parser.parse('$inlinecount=');
        expectToBe(ast.error, 'invalid $inlinecount parameter');

        ast = parser.parse('$inlinecount=test');
        expectToBe(ast.error, 'invalid $inlinecount parameter');
    });

    it('should parse $format okay', () => {
        var ast = parser.parse('$format=application/atom+xml');
        expectToBe(ast.$format, 'application/atom+xml');

        ast = parser.parse('$format=');
        expectToBe(ast.error, 'invalid $format parameter');
    });

    it('should accept identifiers prefixed by _', () => {
        var ast = parser.parse("$filter=_first_name eq 'John'");
        expectToBe(ast.$filter.left.name, "_first_name");
    });

    // it('xxxxx', () => {
    //     var ast = parser.parse("$top=2&$filter=Date gt datetime'2012-09-27T21:12:59'");

    //     console.log(JSON.stringify(ast, 0, 2));
    // });
});
