export type MathJaxSymbol = {
	name: string,
	description: string|string[],
	examples: string|string[],
	see_also: string[],
	snippet: string,
}

export const LATEX_SYMBOLS = [
	{
		"name": "\\!",
		"description": "negative thin space; \u00a0i.e., it \u2018back ups\u2019 a thin space amount",
		"examples": [
			"\\rm IR",
			"\\rm I\\! R"
		],
		"see_also": [
			"\\negthinspace"
		],
		"snippet": ""
	},
	{
		"name": "\\,",
		"description": "\\,thin space (normally $\\frac 16 = \\frac{3}{18}$ of a quad)\n\\:medium space (normally $\\frac 29 = \\frac{4}{18}$ of a quad)\n\\>alternate medium space\n\\;thick space (normally $\\frac 5{18}$ of a quad)",
		"examples": "",
		"see_also": [
			"\\thinspace"
		],
		"snippet": ""
	},
	{
		"name": "\\ ",
		"description": "control space;\n$\\rm\\TeX$ often ignores spaces, or collapses multiple spaces to a single space.\nA control space is used to force $\\rm\\TeX$ to typeset a space.\n\nclass ORD",
		"examples": [
			"\\rm This is a sentence.",
			"\\rm This\\ is\\ a\\ sentence.",
			"\\rm This~is~a~sentence.",
			"\\text{This is a sentence.}"
		],
		"see_also": [
			"\\text"
		],
		"snippet": ""
	},
	{
		"name": "~",
		"description": "In $\\rm\\TeX$ this is a non-breaking space\u2014i.e.,\na blank space where $\\rm\\TeX$ is not allowed to break between lines.\nMathJax (unlike $\\rm\\TeX$) doesn't do any automatic breaking of lines,\nso MathJax will not break at any space.\nThe tilde is useful to force a space where MathJax would otherwise collapse or ignore spaces,\nas illustrated in the",
		"examples": [
			"\\rm Dr. Carol J.V. Fisher",
			"\\rm Dr.~Carol~J.V.~Fisher",
			"\\text{Dr. Carol J.V. Fisher}",
			"a b\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0c d",
			"a~b~~~~~~c~d"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\#",
		"description": "literal number sign; literal pound sign;\nneeded since \u00a0 # \u00a0 is used to indicate arguments in definitions\n\n&#x0023; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\\\$",
		"description": "literal dollar sign;\nneeded since \u00a0 $ \u00a0 may (optionally) be used to delimit math mode\n\nDollar sign outside of math mode: \n\nThe configuration information below enables dollar signs as inline math delimiters;\nsetting \u00a0 processEscapes: \u00a0 to \u00a0 true \u00a0 allows use of \u00a0 \\$ \u00a0 outside of math mode, as a literal dollar sign:\n\nMathJax.Hub.Config({\ntex2jax: {\ninlineMath: [['$','$'],['\\\\(','\\\\)']],\nprocessEscapes: true\n}\n});\n\n&#x0024; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\%",
		"description": "literal percent sign;\nneeded since \u00a0 % \u00a0 is used to begin a single-line comment\n\n&#x0025; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\&",
		"description": "literal ampersand;\nneeded since ampersands are used as separators in alignment environments\nand for HTML entity references inside math mode\n\n&#x0026; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"<code>\\And</code>"
		],
		"snippet": ""
	},
	{
		"name": "\\\\",
		"description": "line separator in alignment modes and environments",
		"examples": [
			"\\begin{gather}a\\\\a+b\\\\a+b+c\\end{gather}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\_",
		"description": "literal underscore;\nneeded since underscores are used for subscripts\n\n&#x005F; \u00a0 class ORD",
		"examples": [
			"a_2",
			"a\\_2"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\{  \\}",
		"description": "literal braces;\nneeded since braces are used for grouping in math mode;\nnon-stretchy when used alone; stretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n\\{ is class OPEN\n\\} is class CLOSE",
		"examples": [
			"{1,2,3}",
			"\\{1,2,3\\}",
			"\\left\\{\\frac ab,c\\right\\}"
		],
		"see_also": [
			"\\brace",
			"\\lbrace",
			"\\rbrace"
		],
		"snippet": ""
	},
	{
		"name": "|",
		"description": "pipe character; vertical bar; absolute value;\nnon-stretchy when used alone; stretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\nclass ORD",
		"examples": [
			"|x|",
			"|\\frac ab|",
			"\\left|\\frac ab\\right|",
			"\\{x | x\\in\\Bbb Z\\}",
			"\\{x\\,|\\,x\\in\\Bbb Z\\}"
		],
		"see_also": [
			"\\lvert",
			"\\rvert",
			"\\vert"
		],
		"snippet": ""
	},
	{
		"name": "\\|",
		"description": "double pipe character; double vertical bar; norm;\nnon-stretchy when used alone; stretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n&#x2225; \u00a0 class ORD",
		"examples": [
			"\\|x\\|",
			"\\|\\frac ab\\|",
			"\\left\\|\\frac ab\\right\\|"
		],
		"see_also": [
			"\\lVert",
			"\\rVert",
			"\\Vert"
		],
		"snippet": ""
	},
	{
		"name": "( )",
		"description": "parentheses;\nnon-stretchy when used alone; stretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n( is class OPEN;\n) is class CLOSE",
		"examples": [
			"(\\frac ab,c)",
			"\\left(\\frac ab,c\\right)"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": ".",
		"description": "period; decimal point\n\nclass PUNCT\n\nIn some math environments (but not all):\n\nWith numbers on either side, there is no surrounding space:\n\n3.14\nyields\n$3.14$\n\nWith non-numeric characters, there is a slight amount of space on right:\na.b\nyields\n$a.b$\n\nTo suppress this space, enclose the \u2018.\u2019 in braces:\na{.}b\nyields\n$a{.}b$",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "/",
		"description": "forward slash;\ncan be used to denote division\n\nclass ORD",
		"examples": [
			"a/b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "+",
		"description": "plus symbol;\ne.g., used for addition\n\nclass BIN",
		"examples": [
			"a+b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "-",
		"description": "minus symbol;\ne.g., used for subtraction\n\nclass BIN",
		"examples": [
			"a-b",
			"-b",
			"\\text{first: } -a\\star b",
			"\\text{first: } {-}a\\star b",
			"-a"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "[ ]",
		"description": "(square) brackets;\nnon-stretchy when used alone; stretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n[ is class OPEN;\n] is class CLOSE",
		"examples": [
			"[\\frac ab,c]",
			"\\left[\\frac ab,c\\right]"
		],
		"see_also": [
			"\\brack",
			"\\lbrack",
			"\\rbrack"
		],
		"snippet": ""
	},
	{
		"name": "=",
		"description": "equal; equals\n\nclass REL",
		"examples": "",
		"see_also": [
			"\\ne",
			"\\neq"
		],
		"snippet": ""
	},
	{
		"name": "'",
		"description": "prime symbol\n\nclass ORD",
		"examples": [
			"f(x) = x^2,\\ \nf'(x) = 2x,\\ \nf''(x) = 2"
		],
		"see_also": [
			"\\prime"
		],
		"snippet": ""
	},
	{
		"name": "\\above",
		"description": "general command for making fractions;\ngives control over thickness of horizontal fraction bar\n{ <subformula1> \\above <dimen> <subformula2> }\nCreates a fraction:\nnumerator: \u00a0 subformula1\ndenominator: \u00a0 subformula2\nfraction bar has thickness: \u00a0 dimen\n\nThere are separate local groups for \u00a0subformula1\u00a0 and \u00a0subformula2\u00a0;\nif these local groups are not explicit, then unexpected results may occur, as illustrated in the\nchoose discussion.",
		"examples": [
			"a+1 \\above 1pt b",
			"a \\above 1pt b+2",
			"{a+1 \\above 1.5pt b+2}+c"
		],
		"see_also": [
			"\\abovewithdelims",
			"\\atop",
			"\\atopwithdelims",
			"\\cfrac",
			"\\dfrac",
			"\\frac",
			"\\genfrac",
			"\\over",
			"\\overwithdelims"
		],
		"snippet": ""
	},
	{
		"name": "\\abovewithdelims",
		"description": "general command for making fractions;\ngives control over thickness of horizontal fraction bar;\nspecifies left and right enclosing\ndelimiters\n\n{ <subformula1> \\abovewithdelims <delim1> <delim2> <dimen> <subformula2> }\n\nCreates a fraction:\nnumerator: \u00a0 subformula1\ndenominator: \u00a0 subformula2\nfraction bar has thickness: \u00a0 dimen\ndelim1 \u00a0 is put before the fraction\ndelim2 \u00a0 is put after the fraction\nFor an empty delimiter, use \u2018.\u2019 in place of the delimiter.\n\nThere are separate local groups for \u00a0subformula1\u00a0 and \u00a0subformula2\u00a0;\nif these local groups are not explicit, then unexpected results may occur, as illustrated in the\nchoose discussion.",
		"examples": [
			"a+1 \\abovewithdelims [ ] 1pt b",
			"{a \\abovewithdelims . | 1.5pt b+2}_{a=3}",
			"{a+1 \\abovewithdelims \\{ \\} 1pt b+2}+c"
		],
		"see_also": [
			"\\above",
			"\\atop",
			"\\atopwithdelims",
			"\\cfrac",
			"\\dfrac",
			"\\frac",
			"\\genfrac",
			"\\over",
			"\\overwithdelims"
		],
		"snippet": ""
	},
	{
		"name": "\\acute",
		"description": "&#x02CA;\nacute accent\n\\acute #1\nUsually, #1 is a single letter; \u00a0otherwise, accent is centered over argument.",
		"examples": [
			"\\acute e",
			"\\acute E",
			"\\acute eu",
			"\\acute{eu}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\aleph",
		"description": "Hebrew letter aleph;\ncommonly used for the cardinality of the real numbers\n\n&#x2135; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\alpha",
		"description": "lowercase Greek letter alpha\n\n&#x03B1; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\amalg",
		"description": "this symbol is often used for co-products\n\n&#x2A3F; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\And",
		"description": "ampersand\n\n&#x0026; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\&"
		],
		"snippet": ""
	},
	{
		"name": "\\angle",
		"description": "&#x2220; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\approx",
		"description": "&#x2248; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\approxeq",
		"description": "&#x224A; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\arccos",
		"description": "does not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples\n\nIf alternate notation is desired, define:\n\\def\\arccosAlt{\\cos^{-1}} \u00a0 so that \u00a0\n$\\arccosAlt(x)$ \u00a0 yields \u00a0\n$\\def\\arccosAlt{\\cos^{-1}} \\arccosAlt(x)$\n\nclass OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\arcsin",
		"description": "does not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples\n\nIf alternate notation is desired, define:\n\\def\\arcsinAlt{\\sin^{-1}} \u00a0 so that \u00a0\n$\\arcsinAlt(x)$ \u00a0 yields \u00a0\n$\\def\\arcsinAlt{\\sin^{-1}} \\arcsinAlt(x)$\n\nclass OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\arctan",
		"description": "does not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples\n\nIf alternate notation is desired, define:\n\\def\\arctanAlt{\\tan^{-1}} \u00a0 so that \u00a0\n$\\arctanAlt(x)$ \u00a0 yields \u00a0\n$\\def\\arctanAlt{\\tan^{-1}} \\arctanAlt(x)$\n\nclass OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\arg",
		"description": "the complex argument function;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\array",
		"description": "a synonym for \u00a0\\matrix\u00a0\n\\array{ <math> & <math> ... \\cr <repeat as needed> }\nalignment occurs at the ampersands;\na double-backslash can be used in place of the \u00a0\\cr\u00a0;\nthe final \u00a0 \\\\ \u00a0 or \u00a0 \\cr \u00a0 is optional",
		"examples": [
			"\\array{ a & b+1 \\cr c+1 & d }"
		],
		"see_also": [
			"\\matrix"
		],
		"snippet": "\\array{ @1@ & @2@ \\cr @3@ & @4@ }"
	},
	{
		"name": "\\arrowvert",
		"description": "not intended for direct use;\nused internally to create stretchy delimiters\n\n&#x23D0; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"|",
			"\\vert",
			"\\lvert",
			"\\rvert"
		],
		"snippet": ""
	},
	{
		"name": "\\Arrowvert",
		"description": "not intended for direct use;\nused internally to create stretchy delimiters\n\n&#x2016; \u00a0 class PUNCT",
		"examples": "",
		"see_also": [
			"\\|",
			"\\Vert",
			"\\lVert",
			"\\rVert"
		],
		"snippet": ""
	},
	{
		"name": "\\ast",
		"description": "asterisk\n\n&#x2217; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\asymp",
		"description": "asymptotic\n\n&#x224D; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\atop",
		"description": "general command for making a fraction-like structure, but without the horizontal fraction bar\n{ <subformula1> \\atop <subformula2> }\nCreates a fraction-like structure:\n\u2018numerator\u2019 \u00a0 subformula1\n\u2019denominator\u2019 \u00a0 subformula2\n\nThere are separate local groups for \u00a0subformula1\u00a0 and \u00a0subformula2\u00a0;\nif these local groups are not explicit, then unexpected results may occur, as illustrated in the\nchoose discussion.",
		"examples": [
			"a \\atop b",
			"a+1 \\atop b+2",
			"{a+1 \\atop b+2}+c"
		],
		"see_also": [
			"\\above",
			"\\abovewithdelims",
			"\\atopwithdelims",
			"\\cfrac",
			"\\dfrac",
			"\\frac",
			"\\genfrac",
			"\\over",
			"\\overwithdelims"
		],
		"snippet": "@1@ \\atop @2@"
	},
	{
		"name": "\\atopwithdelims",
		"description": "general command for making a fraction-like structure, but without the horizontal fraction bar;\nspecifies left and right enclosing delimiters\n\n{ <subformula1> \\atopwithdelims <delim1> <delim2> <subformula2> }\n\nCreates a fraction-like structure:\n\u2018numerator\u2019 \u00a0 subformula1\n\u2018denominator\u2019 \u00a0 subformula2\ndelim1 \u00a0 is put before the structure\ndelim2 \u00a0 is put after the structure\nFor an empty delimiter, use \u2018.\u2019 in place of the delimiter.\n\nThere are separate local groups for \u00a0subformula1\u00a0 and \u00a0subformula2\u00a0;\nif these local groups are not explicit, then unexpected results may occur, as illustrated in the\nchoose discussion.",
		"examples": [
			"a \\atopwithdelims [ ] b",
			"a+1 \\atopwithdelims . | b+2",
			"{a+1 \\atopwithdelims \\{ \\} b+2}+c"
		],
		"see_also": [
			"\\above",
			"\\abovewithdelims",
			"\\atop",
			"\\cfrac",
			"\\dfrac",
			"\\frac",
			"\\genfrac",
			"\\over",
			"\\overwithdelims"
		],
		"snippet": "@1@ \\atopwithdelims @2@ @3@ @4@"
	},
	{
		"name": "\\backepsilon",
		"description": "&#x220D; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\backprime",
		"description": "",
		"examples": "",
		"see_also": [
			"\\prime",
			"ORD"
		],
		"snippet": ""
	},
	{
		"name": "\\backsim",
		"description": "&#x223D; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\backsimeq",
		"description": "&#x22CD; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\backslash",
		"description": "",
		"examples": "",
		"see_also": [
			"\\setminus"
		],
		"snippet": ""
	},
	{
		"name": "\\bar",
		"description": "bar accent (non-stretchy)\n\n&#x02C9;\n\n\\bar #1\nUsually, #1 is a single letter; \u00a0otherwise, bar is centered over argument.",
		"examples": [
			"\\bar x",
			"\\bar X",
			"\\bar xy",
			"\\bar{xy}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\barwedge",
		"description": "&#x22BC; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Bbb",
		"description": "blackboard-bold for uppercase letters and lowercase \u2018k\u2019;\nif lowercase blackboard-bold letters are not available, then they are typeset in a roman font\n\nclass ORD\n\n\\Bbb #1\nWhether lower-case letters are displayed in blackboard-bold, or not, depends on the fonts being used.\nThe MathJax web-based fonts don't have lowercase blackboard-bold, but the STIX fonts do;\nso users with the STIX fonts installed will be able to display lowercase blackboard-bold letters.",
		"examples": [
			"\\Bbb R",
			"\\Bbb ZR",
			"\\Bbb{AaBbKk}Cc",
			"\\Bbb{ABCDEFGHIJKLMNOPQRSTUVWXYZ}"
		],
		"see_also": [
			"\\mathbb"
		],
		"snippet": ""
	},
	{
		"name": "\\Bbbk",
		"description": "blackboard-bold lowercase k\n\n&#x006B; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\because",
		"description": "&#x2235; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\begin",
		"description": "used in \u00a0\n\\begin{xxx} ... \\end{xxx} \u00a0 environments",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\beta",
		"description": "lowercase Greek letter beta\n\n&#x03B2; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\beth",
		"description": "Hebrew letter beth\n\n&#x2136; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\between",
		"description": "&#x226C; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bf",
		"description": "turns on boldface; \u00a0affects uppercase and lowercase letters, and digits\n\nclass ORD\n\n{\\bf ... }",
		"examples": [
			"\\bf AaBb\\alpha\\beta123",
			"{\\bf A B} A B",
			"\\bf AB \\rm CD",
			"\\bf{AB}CD"
		],
		"see_also": [
			"\\mathbf",
			"\\boldsymbol"
		],
		"snippet": ""
	},
	{
		"name": "\\Bigg",
		"description": "used to obtain various-sized delimiters;\nmay be followed by any of these Variable-Sized Delimiters",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Biggl",
		"description": "Used to obtain various-sized delimiters, with a left/right/middle context;\nmay be followed by any of these Variable-Sized Delimiters.\n\nThe \u2018l\u2019 (left), \u2019m\u2019 (middle), and \u2018r\u2019 (right) specifications\nmay make reading the source code more meaningful,\nespecially when there are delimiters inside delimiters.\n\nWhereas (say) \u00a0\\Bigg\u00a0 produces results of class ORD, we have:\n\n\u00a0\\Biggl\u00a0 produces results of class OPEN\n\u00a0\\Biggr\u00a0 produces results of class CLOSE\n\u00a0\\Biggm\u00a0 produces results of class REL\n\nThe spacing for these differ (but may not always be apparent, as it depends on the class of what is next to it).\nFor example, \u00a0$x\\big| y$\u00a0 ($\\,x\\big| y\\,$)\nhas less space than \u00a0$x\\bigm| y$\u00a0 ($\\,x\\bigm| y\\,$).\nTherefore, these commands affect typeset results in a fundamental way;\nit is best to use the form appropriate for the position of the desired delimiter.",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigcap",
		"description": "changes size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\n&#x22C2; \u00a0 class OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigcirc",
		"description": "&#x25EF; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigcup",
		"description": "changes size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\n&#x22C3; \u00a0 class OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigodot",
		"description": "all change size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\n&#x2A00; \u00a0 class OP\n\n&#x2A01; \u00a0 class OP\n&#x2A02; \u00a0 class OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigsqcup",
		"description": "changes size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\n&#x2A06; \u00a0 class OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigstar",
		"description": "&#x2605; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigtriangledown",
		"description": "&#x25BD; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigtriangleup",
		"description": "&#x25B3; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\biguplus",
		"description": "changes size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\n&#x2A04; \u00a0 class OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigvee",
		"description": "changes size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\n&#x22C1; \u00a0 class OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bigwedge",
		"description": "changes size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\n&#x22C0; \u00a0 class OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\binom",
		"description": "notation commonly used for binomial coefficients\n\\binom #1 #2",
		"examples": [
			"\\binom n k",
			"\\binom n k",
			"\\binom{n-1}k-1",
			"\\binom{n-1}{k-1}"
		],
		"see_also": [
			"\\binom",
			"\\choose",
			"\\dbinom",
			"\\tbinom"
		],
		"snippet": "\\binom{@1@}{@2@}"
	},
	{
		"name": "\\blacklozenge",
		"description": "&#x29EB; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\blacksquare",
		"description": "&#x25A0; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\blacktriangle",
		"description": "&#x25B2; \u00a0\nclass ORD\n\n&#x25BC; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\blacktriangleleft",
		"description": "&#x25C0; \u00a0\nclass BIN\n\n&#x25B6; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bmod",
		"description": "properly spaced as a binary operator\n\nclass BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\boldsymbol",
		"description": "as opposed to \u00a0\\bf\u00a0 and \u00a0\\mathbf\u00a0,\n\\boldsymbol\u00a0 applies to nearly all symbols, not just letters and numbers\n\nclass ORD\n\n\\boldsymbol #1",
		"examples": [
			"\\boldsymbol aa",
			"\\boldsymbol \\alpha\\alpha",
			"\\boldsymbol{a\\alpha}a\\alpha",
			"\\boldsymbol{a+2+\\alpha+\\frac{x+3}{\\beta+4}}",
			"\\mathbf{a+2+\\alpha+\\frac{x+3}{\\beta+4}}"
		],
		"see_also": [
			"\\bf",
			"\\mathbf"
		],
		"snippet": ""
	},
	{
		"name": "\\bot",
		"description": "&#x22A5; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\bowtie",
		"description": "&#x22C8; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Box",
		"description": "&#x25A1; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\boxdot",
		"description": "&#x22A1; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\boxed",
		"description": "puts a box around argument; argument is in math mode\n\\boxed #1",
		"examples": [
			"\\boxed ab",
			"\\boxed{ab}",
			"\\boxed{ab\\strut}",
			"\\boxed{\\text{boxed text}}"
		],
		"see_also": [
			"\\fbox"
		],
		"snippet": "\\boxed{@1@}"
	},
	{
		"name": "\\boxminus",
		"description": "&#x229F; \u00a0\nclass BIN\n\n&#x229E; \u00a0\nclass BIN\n\n&#x22A0; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\brace",
		"description": "creates a braced structure\n{ <subformula1> \\brace <subformula2> }",
		"examples": [
			"\\brace",
			"a\\brace b",
			"a+b+c\\brace d+e+f",
			"a+{b+c\\brace d+e}+f"
		],
		"see_also": [],
		"snippet": "@1@ \\brace @2@"
	},
	{
		"name": "\\bracevert",
		"description": "not intended for direct use;\nused internally to create stretchy delimiters\n\n&#x23AA; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\brack",
		"description": "creates a bracketed structure\n{ <subformula1> \\brack <subformula2> }",
		"examples": [
			"\\brack",
			"a\\brack b",
			"a+b+c\\brack d+e+f",
			"a+{b+c\\brack d+e}+f"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\breve",
		"description": "breve accent\n\n&#x02D8;\n\n\\breve #1\nUsually, #1 is a single letter; \u00a0otherwise, accent is centered over argument.",
		"examples": [
			"\\breve e",
			"\\breve E",
			"\\breve eu",
			"\\breve{eu}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\buildrel",
		"description": "\\buildrel <subformula1> \\over #1\nThe result is of class \u00a0REL\u00a0 (binary relation), so it has the\nspacing of a relation.",
		"examples": [
			"\\buildrel \\alpha\\beta \\over \\longrightarrow",
			"\\buildrel \\rm def \\over {:=}"
		],
		"see_also": [],
		"snippet": "\\buildrel @1@ \\over @2@"
	},
	{
		"name": "\\bullet",
		"description": "&#x2219; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Bumpeq",
		"description": "&#x224E; \u00a0\nclass REL\n\n&#x224F; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\cal",
		"description": "class ORD\nturns on calligraphic mode; \u00a0only affects uppercase letters and digits\n{\\cal ... }",
		"examples": [
			"\\cal ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"\\cal 0123456789",
			"\\cal abcdefghijklmnopqrstuvwxyz",
			"abcdefghijklmnopqrstuvwxyz",
			"{\\cal AB}AB",
			"\\cal AB \\rm AB",
			"\\cal{AB}CD"
		],
		"see_also": [
			"\\oldstyle",
			"\\mathcal"
		],
		"snippet": ""
	},
	{
		"name": "\\cancel",
		"description": "Used to \u2018cancel\u2019 (strikeout).\n\n\\cancel #1\n\\bcancel #1",
		"examples": [
			"\\frac{(x+1)\\cancel{(x+2)}}{3\\cancel{(x+2)}}",
			"\\frac{\\bcancel{\\frac13}}{\\bcancel{\\frac13}} = 1"
		],
		"see_also": [],
		"snippet": "\\cancel{@1@}"
	},
	{
		"name": "\\Cap",
		"description": "&#x22D2; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [
			"\\bigcap",
			"\\cap",
			"\\Cup",
			"\\cup",
			"\\doublecap",
			"\\doublecup"
		],
		"snippet": ""
	},
	{
		"name": "\\cap",
		"description": "&#x2229; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [
			"\\bigcap",
			"\\Cap",
			"\\Cup",
			"\\cup",
			"\\doublecap",
			"\\doublecup"
		],
		"snippet": ""
	},
	{
		"name": "\\cases",
		"description": "class OPEN\nfor piecewise-defined functions\n\\cases{ <math> & <math> \\cr <repeat as needed> }\na double-backslash can be used in place of \u00a0 \\cr\u00a0;\nthe final \u00a0 \\\\ \u00a0 or \u00a0 \\cr \u00a0 is optional\n\nIn $\\,\\rm\\TeX\\,$, the second column is automatically in text-mode, while in MathJax it is in math-mode.\nThis behavior will be changed to be consistent with $\\,\\rm\\TeX\\,$ in a future release of MathJax.",
		"examples": [
			"\n|x| = \n\\cases{\nx  & \\text{if } x\\ge 0\\cr\n-x & \\text{if } x\\lt 0\n}\n"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\cdot",
		"description": "&#x22C5; \u00a0\nclass BIN\ncentered dot",
		"examples": [
			"a\\cdot b",
			"a\\cdotp b",
			"a\\centerdot b"
		],
		"see_also": [
			"\\cdotp",
			"\\cdots",
			"\\centerdot"
		],
		"snippet": ""
	},
	{
		"name": "\\cdotp",
		"description": "&#x22C5; \u00a0\nclass PUNCT\ncentered dot, punctuation symbol",
		"examples": [
			"\\rm s \\cdot h",
			"\\rm s \\cdotp h"
		],
		"see_also": [
			"\\cdot",
			"\\centerdot"
		],
		"snippet": ""
	},
	{
		"name": "\\cdots",
		"description": "&#x22EF; \u00a0\nclass INNER\ncentered dots; \u00a0 dot dot dot",
		"examples": "",
		"see_also": [
			"\\dots",
			"\\ldots"
		],
		"snippet": ""
	},
	{
		"name": "\\centerdot",
		"description": "&#x22C5; \u00a0\nclass BIN\ncentered dot",
		"examples": [
			"a\\cdot b",
			"a\\cdotp b",
			"a\\centerdot b"
		],
		"see_also": [
			"\\cdot",
			"\\cdotp"
		],
		"snippet": ""
	},
	{
		"name": "\\cfrac",
		"description": "use for continued fractions\n\\cfrac #1 #2",
		"examples": [
			"\\frac{2}{1+\\frac{2}{1+\\frac{2}{1}}}",
			"\\cfrac{2}{1+\\cfrac{2}{1+\\cfrac{2}{1}}}"
		],
		"see_also": [
			"\\above",
			"\\abovewithdelims",
			"\\atop",
			"\\atopwithdelims",
			"\\dfrac",
			"\\frac",
			"\\genfrac",
			"\\over",
			"\\overwithdelims"
		],
		"snippet": "\\cfrac{@1@}{@2@}"
	},
	{
		"name": "\\check",
		"description": "&#x02C7;\ncheck accent\n\\check #1\nUsually, #1 is a single letter; \u00a0otherwise, accent is centered over argument.",
		"examples": [
			"\\check o",
			"\\check O",
			"\\check oe",
			"\\check{oe}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\checkmark",
		"description": "#x2713; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\chi",
		"description": "&#x03C7; \u00a0\nclass ORD\nlowercase Greek letter chi",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\choose",
		"description": "notation commonly used for binomial coefficients;\ndifferent versions for inline and display modes\n{ <subformula1> \\choose <subformula2> }\nThere are separate local groups for \u00a0subformula1\u00a0\nand \u00a0subformula2\u00a0;\nif these local groups are not explicit, then unexpected results may occur,\nas illustrated next.",
		"examples": [
			"3 \\choose 2",
		],
		"see_also": [
			"\\binom",
			"\\dbinom",
			"\\tbinom"
		],
		"snippet": "@1@ \\choose @2@"
	},
	{
		"name": "\\circ",
		"description": "&#x2218; \u00a0\nclass BIN",
		"examples": [
			"(f\\circ g)(x) = f(g(x))",
			"45^\\circ"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\circeq",
		"description": "&#x2257; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\circlearrowleft",
		"description": "&#x21BA;\ncounterclockwise\nclass REL\n\n&#x21BB;\nclockwise\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\circledast",
		"description": "&#x229B;circled asteriskclass BIN\n&#x229A;circled circleclass BIN\n&#x229D;circled dashclass BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\circledR",
		"description": "&#x00AE;circled Rclass ORD\n&#x24C8;circled Sclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\class",
		"description": "non-standard; extension is loaded automatically when used;\nused to specify a CSS class for styling mathematics\n\\class #1 #2\nwhere:\n\n#1\u00a0 is a CSS class name (without quotes)\n#2\u00a0 is the mathematics to be styled",
		"examples": [
			"ab\\class{smHighlightRed}{cdef}gh"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\clubsuit",
		"description": "&#x2663; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [
			"\\diamondsuit",
			"\\heartsuit",
			"\\spadesuit"
		],
		"snippet": ""
	},
	{
		"name": "\\colon",
		"description": "&#x003A; \u00a0\nclass PUNCT\n\na colon, treated as a punctuation mark (instead of a relation)",
		"examples": [
			"f:A\\to B",
			"f\\colon A\\to B"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\color",
		"description": "used to specify a color in mathematics\n\\color #1 #2\nwhere:\n#1 \u00a0 is the desired color\n#2 \u00a0 is the mathematics to be colored\n\nThis works differently from standard $\\,\\rm\\LaTeX\\,$ (where \u00a0\\color\u00a0 is a switch).\nIn a future version of MathJax, it will be possible to load an extension\nto make the command behave like the $\\,\\rm\\LaTeX\\,$ version.",
		"examples": [
			"\\color{red}{ \\frac{1+\\sqrt{5}}{2} }",
			"\\color{#0000FF}AB"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\complement",
		"description": "&#x2201; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\cong",
		"description": "&#x2245; \u00a0\nclass REL\n\ncongruent",
		"examples": "",
		"see_also": [
			"\\ncong"
		],
		"snippet": ""
	},
	{
		"name": "\\coprod",
		"description": "&#x2210; \u00a0\nclass OP\n\ncoproduct",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\cos",
		"description": "class OP\ncosine;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples",
		"examples": [
			"\\cos x",
			"\\cos(2x-1)"
		],
		"see_also": [
			"\\sin"
		],
		"snippet": ""
	},
	{
		"name": "\\cosh",
		"description": "class OP\nhyperbolic cosine;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples\nhyperbolic cosine",
		"examples": [
			"\\cosh x",
			"\\cosh(2x-1)"
		],
		"see_also": [
			"\\sinh"
		],
		"snippet": ""
	},
	{
		"name": "\\cot",
		"description": "class OP\ncotangent;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples",
		"examples": [
			"\\cot x",
			"\\cot(2x-1)"
		],
		"see_also": [
			"\\tan"
		],
		"snippet": ""
	},
	{
		"name": "\\coth",
		"description": "class OP\nhyperbolic cotangent;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples",
		"examples": [
			"\\coth x",
			"\\coth(2x-1)"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\cr",
		"description": "carriage return;\nline separator in alignment modes and environments\n\nin MathJax, these are essentially the same: \u00a0 \\\\,\n\u00a0 \\newline",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\csc",
		"description": "class OP\ncosecant\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples",
		"examples": [
			"\\csc x",
			"\\csc(2x-1)"
		],
		"see_also": [
			"\\sec"
		],
		"snippet": ""
	},
	{
		"name": "\\cssId",
		"description": "non-standard; \u00a0 class ORD; \u00a0\nextension is loaded automatically when used;\n\nused to set a MathML element's ID attribute, so it can be accessed dynamically\n(e.g., to add an event handler, add CSS styling, or set display status)\n\n\\cssId #1 #2\n\nwhere:\n\n#1\u00a0 is an ID attribute (without quotes)\n#2\u00a0 is the mathematics to be identified by the ID",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Cup",
		"description": "&#x22D3; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [
			"\\bigcup",
			"\\Cap",
			"\\cap",
			"\\cup",
			"\\doublecap",
			"\\doublecup"
		],
		"snippet": ""
	},
	{
		"name": "\\cup",
		"description": "&#x222A; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [
			"\\bigcup",
			"\\Cap",
			"\\cap",
			"\\Cup",
			"\\doublecap",
			"\\doublecup"
		],
		"snippet": ""
	},
	{
		"name": "\\curlyeqprec",
		"description": "&#x22DE;class REL\n&#x22DF;class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\curlyvee",
		"description": "&#x22CE;class BIN \n&#x22CF;class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\curvearrowleft",
		"description": "&#x21B6;counterclockwiseclass REL\n&#x21B7;clockwiseclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\dagger",
		"description": "&#x2020;daggerclass BIN\n&#x2021;double daggerclass BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\daleth",
		"description": "&#x2138; \u00a0 class ORD \nHebrew letter daleth",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\dashleftarrow",
		"description": "&#x21E0;dashed left arrow; non-stretchyclass REL\n&#x21E2;dashed right arrow; non-stretchyclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\dashv",
		"description": "&#x22A3; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\dbinom",
		"description": "notation commonly used for binomial coefficients;\ndisplay version (in both inline and display modes)\n\\dbinom #1 #2",
		"examples": [
			"\\dbinom n k",
			"\\dbinom n k",
			"\\dbinom{n-1}k-1",
			"\\dbinom{n-1}{k-1}"
		],
		"see_also": [
			"\\binom",
			"\\choose",
			"\\tbinom"
		],
		"snippet": "\\dbinom{@1@}{@2@}"
	},
	{
		"name": "\\dot",
		"description": "&#x02D9;dot accent\n&#x00A8;double dot accent\ntriple dot accent\nquadruple dot accent\n\n\\dot #1\n\\ddot #1\n\\dddot #1\n\\ddddot #1\nUsually, #1 is a single letter; \u00a0otherwise, accent is centered over argument.",
		"examples": [
			"\\dot x",
			"\\ddot x",
			"\\dddot x",
			"\\ddddot x",
			"\\ddot x(t)",
			"\\ddddot{y(x)}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\ddots",
		"description": "&#x22F1; \u00a0 class INNER\nthree diagonal dots",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\DeclareMathOperator",
		"description": "Multi-letter operator names (like $\\,\\log\\,$,\n$\\,\\sin\\,$, and $\\,\\lim\\,$) are traditionally typeset in a roman font.\n\\DeclareMathOperator\u00a0 allows you to define your own\noperator names;\nthey are subsequently typeset using the proper font and spacing;\nyou can control the way that limits appear (see",
		"examples": [
			"myOp(x)",
			"\\text{myOp}(x)",
			"\\myOp_a^b(x)",
			"\\myOp_a^b(x)",
			"\n                                    \\DeclareMathOperator*\n                                    {\\myOP}{myOP}\n                                    \\myOP_a^b(x)\n                                ",
			"\\myOp",
			"\\myOP",
			"DeclareMathOperator*",
			"DeclareMathOperator"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\def",
		"description": "for defining your own commands (control sequences, macros, definitions);\nmust appear (within math delimiters) before it is used;\nalternatively, you can\ndefine macros using the MathJax configuration\noptions in the \u00a0<head>\n\\def\\myCommandName{ <replacement text> }",
		"examples": "",
		"see_also": [
			"\\newcommand"
		],
		"snippet": ""
	},
	{
		"name": "\\deg",
		"description": "class OP\ndegree;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Delta",
		"description": "&#x0394;uppercase Greek letter deltaclass ORD\n&#x03B4;lowercase Greek letter deltaclass ORD",
		"examples": "",
		"see_also": [
			"\\varDelta"
		],
		"snippet": ""
	},
	{
		"name": "\\det",
		"description": "class OP\ndeterminant;\ndoes not change size;\ndefault limit placement can be changed using \u00a0\\limits\u00a0 and  \u00a0\\nolimits;\ndoes not change size;\nsee the Big Operators Table for more examples",
		"examples": [
			"\\det_{\\rm sub}",
			"\\det_{\\rm sub}",
			"\\det\\limits_{\\rm sub}",
			"\\det\\nolimits_{\\rm sub}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\dfrac",
		"description": "fractions;\ndisplay version (in both inline and display modes)\n\\dfrac #1 #2",
		"examples": [
			"\\dfrac a b",
			"\\dfrac a b",
			"\\frac a b",
			"\\dfrac{a-1}b-1",
			"\\dfrac{a-1}{b-1}"
		],
		"see_also": [
			"\\above",
			"\\abovewithdelims",
			"\\atop",
			"\\atopwithdelims",
			"\\cfrac",
			"\\frac",
			"\\genfrac",
			"\\over",
			"\\overwithdelims"
		],
		"snippet": "\\dfrac{@1@}{@2@}"
	},
	{
		"name": "\\diagdown",
		"description": "&#x2572;diagonal down (from left to right)class ORD\n&#x2571;diagonal up (from left to right)class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Diamond",
		"description": "&#x25CA;large diamondclass ORD\n&#x22C4;small diamondclass BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\diamondsuit",
		"description": "&#x2662; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\clubsuit",
			"\\heartsuit",
			"\\spadesuit"
		],
		"snippet": ""
	},
	{
		"name": "\\digamma",
		"description": "&#x03DD; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\dim",
		"description": "class OP\ndimension;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using  \\limits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\displaylines",
		"description": "to display any number of centered formulas (without any alignment)\n\\displaylines{ <math> \\cr <repeat as needed> }\na double-backslash can be used in place of the \\cr;\nthe final \u00a0 \\\\ \u00a0 or \u00a0 \\cr \u00a0 is optional",
		"examples": [
			"\n\\displaylines{\na = a\\\\\n\\text{if } a=b \\text{ then } b=a\\\\\n\\text{if } a=b \\text{ and } b=c \\text{ then } a=c\n}\n"
		],
		"see_also": [
			"gather"
		],
		"snippet": ""
	},
	{
		"name": "\\displaystyle",
		"description": "class ORD\nused to over-ride automatic style rules and force display style;\nstays in force until the end of math mode or the braced group, or until another style is selected\n{ \\displaystyle ... }",
		"examples": "",
		"see_also": [
			"\\textstyle",
			"\\scriptstyle",
			"\\scriptscriptstyle"
		],
		"snippet": ""
	},
	{
		"name": "\\div",
		"description": "&#x00F7; \u00a0 class BIN\ndivision symbol",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\divideontimes",
		"description": "&#x22C7; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Doteq",
		"description": "&#x2251;class REL\n&#x2250;class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\dotplus",
		"description": "&#x2214; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\dots",
		"description": "&#x2026; \u00a0 class INNER\nlower dots; \u00a0 ellipsis; \u00a0 ellipses; \u00a0 dot dot dot\n\nIn $\\,\\rm\\LaTeX\\,$, \u00a0\\dots\u00a0 chooses either\n\u00a0\\cdots\u00a0 or \u00a0\\ldots\u00a0\ndepending on the context;\nMathJax, however, always gives lower dots.",
		"examples": [
			"x_1, \\dots, x_n",
			"x_1 + \\dots + x_n",
			"x_1 + \\dotsb + x_n",
			"x_1 + \\cdots + x_n"
		],
		"see_also": [
			"\\cdots",
			"\\ldots",
			"\\dotsb",
			"\\dotsc",
			"\\dotsi",
			"\\dotsm",
			"\\dotso"
		],
		"snippet": ""
	},
	{
		"name": "\\dotsb",
		"description": "&#x22EF;\\dotsbclass INNERdots with binary operations and relations$x_1 + x_2 +\\dotsb + x_n$\n&#x2026;\\dotscclass INNERdots with commas$x_1,x_2,\\dotsc,x_n$\n&#x22EF;\\dotsiclass INNERdots with integrals$\\int_{A_1}\\int_{A_2}\\dotsi\\int_{A_n}$\n&#x22EF;\\dotsmclass INNERdots with multiplication$x_1x_2\\dotsm x_n$\n&#x2026;\\dotsoclass INNERother dots$A_1\\dotso A_n$",
		"examples": "",
		"see_also": [
			"\\cdots",
			"\\dots",
			"\\ldots"
		],
		"snippet": ""
	},
	{
		"name": "\\doublebarwedge",
		"description": "&#x2A5E; \u00a0 BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\doublecap",
		"description": "&#x22D2;class BIN\n&#x22D3;class BIN",
		"examples": "",
		"see_also": [
			"\\Cap",
			"\\Cup",
			"\\cap",
			"\\cup"
		],
		"snippet": ""
	},
	{
		"name": "\\downarrow",
		"description": "&#x2193;down arrow; non-stretchyclass REL\n&#x21D3;double down arrow; non-stretchyclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\downdownarrows",
		"description": "&#x21CA; \u00a0 class REL\ndown down arrows; non-stretchy",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\downharpoonleft",
		"description": "&#x21C3;down harpoon left; non-stretchyclass REL\n&#x21C2;down harpoon right; non-stretchyclass REL",
		"examples": "",
		"see_also": [
			"\\leftharpoondown",
			"\\leftharpoonup"
		],
		"snippet": ""
	},
	{
		"name": "\\ell",
		"description": "&#x2113; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\emptyset",
		"description": "&#x2205; \u00a0 class ORD\nempty set",
		"examples": "",
		"see_also": [
			"\\varnothing"
		],
		"snippet": ""
	},
	{
		"name": "\\end",
		"description": "used in \u00a0\n\\begin{xxx} ... \\end{xxx} \u00a0 environments",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\enspace",
		"description": "\\enspace \u00a0 is a 0.5em space",
		"examples": [
			"|\\enspace|\\enspace|"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\epsilon",
		"description": "&#x03F5; \u00a0 class ORD\nlowercase Greek letter epsilon",
		"examples": "",
		"see_also": [
			"\\varepsilon"
		],
		"snippet": ""
	},
	{
		"name": "\\eqalign",
		"description": "equation alignment;\nfor aligning multi-line displays at a single place\n\\eqalign{ <math> & <math> \\cr <repeat as needed> }\nthe ampersand is placed where alignment is desired;\na double-backslash can be used in place of the \u00a0\\cr\u00a0;\nthe final \u00a0 \\\\ \u00a0 or \u00a0 \\cr \u00a0 is optional;\nsupports only a single \\tag, which is vertically centered",
		"examples": "",
		"see_also": [
			"\\eqalignno",
			"align environment",
			"\\tag"
		],
		"snippet": ""
	},
	{
		"name": "\\eqalignno",
		"description": "equation alignment with optionally numbered (tagged) lines\n\\eqalignno{ <math> & <math> & <equation tag> \\cr <repeat as needed> }\nthe first ampersand is placed where alignment is desired;\nthe second ampersand is used just before a tag;\nif there is no tag, then the final  \u00a0 & <equation tag> \u00a0 is omitted;\na double-backslash can be used in place of the \u00a0\\cr\u00a0;\nthe final \u00a0 \\\\ \u00a0 or \u00a0 \\cr \u00a0 is optional",
		"examples": "",
		"see_also": [
			"\\eqalign",
			"\\leqalignno",
			"align environment"
		],
		"snippet": ""
	},
	{
		"name": "\\eqcirc",
		"description": "&#x2256; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\eqsim",
		"description": "&#x2242; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\eqslantgtr",
		"description": "&##x2A96;\n\nclass REL\n\n&##x2A95;class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\equiv",
		"description": "&#x2261; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\eta",
		"description": "&#x03B7; \u00a0\nclass ORD\nlowercase Greek letter eta",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\eth",
		"description": "&#x00F0; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\exists",
		"description": "&#x2203; \u00a0\nclass ORD\nthere exists",
		"examples": "",
		"see_also": [
			"\\nexists"
		],
		"snippet": ""
	},
	{
		"name": "\\exp",
		"description": "class OP\nexponential function;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\fallingdotseq",
		"description": "&#x2252; \u00a0\nclass REL\nfalling dot sequence;",
		"examples": "",
		"see_also": [
			"\\risingdotseq"
		],
		"snippet": ""
	},
	{
		"name": "\\fbox",
		"description": "puts a box around argument; argument is in text mode\nequivalent to: \\boxed{\\text{#1}}\n\\fbox #1\nwhere #1 is rendered as text",
		"examples": [
			"\\boxed{Hi there!}",
			"\\fbox{Hi there!}"
		],
		"see_also": [
			"\\boxed"
		],
		"snippet": ""
	},
	{
		"name": "\\Finv",
		"description": "&#x2132; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\flat",
		"description": "&#x266D; \u00a0\nclass ORD\nmusical flat symbol",
		"examples": "",
		"see_also": [
			"\\natural",
			"\\sharp"
		],
		"snippet": ""
	},
	{
		"name": "\\forall",
		"description": "&#x2200; \u00a0\nclass ORD\nuniversal quantifier; for all; for every; for each",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\frac",
		"description": "fractions;\ndisplays differently in inline and display modes\n\\frac #1 #2",
		"examples": [
			"\\frac a b",
			"\\frac a b",
			"\\frac{a-1}b-1",
			"\\frac{a-1}{b-1}"
		],
		"see_also": [
			"\\above",
			"\\abovewithdelims",
			"\\atop",
			"\\atopwithdelims",
			"\\cfrac",
			"\\dfrac",
			"\\genfrac",
			"\\over",
			"\\overwithdelims"
		],
		"snippet": "\\frac{@1@}{@2@}"
	},
	{
		"name": "\\frak",
		"description": "class ORD\nturns on fraktur; \u00a0affects uppercase and lowercase letters, and digits\n{\\frak ... }",
		"examples": [
			"\\frak ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"\\frak 0123456789",
			"\\frak abcdefghijklmnopqrstuvwxyz",
			"{\\frak AB}AB",
			"\\frak AB \\rm AB",
			"{\\frak AB \\cal AB} AB"
		],
		"see_also": [
			"\\mathfrak"
		],
		"snippet": ""
	},
	{
		"name": "\\frown",
		"description": "&#x2322; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\smallfrown",
			"\\smallsmile",
			"\\smile"
		],
		"snippet": ""
	},
	{
		"name": "\\Game",
		"description": "&#x2141; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Gamma",
		"description": "&#x0393; \u00a0\nclass ORD\nuppercase Greek letter gamma",
		"examples": "",
		"see_also": [
			"\\varGamma"
		],
		"snippet": ""
	},
	{
		"name": "\\gamma",
		"description": "&#x03B3; \u00a0\nclass ORD\nlowercase Greek letter gamma",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gcd",
		"description": "class OP\ngreatest common divisor;\ndoes not change size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples",
		"examples": [
			"\\gcd_{\\rm sub}^{\\rm sup}",
			"\\gcd_{\\rm sub}^{\\rm sup}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\ge",
		"description": "&#x2265; \u00a0 \\ge\n&#x2265; \u00a0 \\geq\n&#x2267; \u00a0 \\geqq\n&#x2A7E; \u00a0 \\geqslant\n\nall class REL\ngreater than or equal to",
		"examples": "",
		"see_also": [
			"\\ngeq",
			"\\ngeqq",
			"\\ngeqslant"
		],
		"snippet": ""
	},
	{
		"name": "\\genfrac",
		"description": "the most general command for defining fractions with optional delimiters,\nline thickness, and specified style\n\\genfrac #1 #2 #3 #4 #5 #6\nwhere:\n\n#1 is the left delimiter (empty, for no left delimiter)\n#2 is the right delimiter (empty, for no right delimiter)\n#3 is the fraction bar thickness (set to 0pt to make it disappear)\n\n#4 is either 0, 1, 2, or 3, where:\n\n0 denotes \\displaystyle\n1 denotes \\textstyle\n2 denotes \\scriptstyle\n3 denotes \\scriptscriptstyle\n\n#5 is the numerator\n#6 is the denominator",
		"examples": [
			"\\genfrac(]{0pt}{2}{a+b}{c+d}"
		],
		"see_also": [
			"\\above",
			"\\abovewithdelims",
			"\\atop",
			"\\atopwithdelims",
			"\\cfrac",
			"\\dfrac",
			"\\frac",
			"\\over",
			"\\overwithdelims"
		],
		"snippet": ""
	},
	{
		"name": "\\gets",
		"description": "&#x2190; \u00a0\nclass REL\nleft arrow;\nnon-stretchy",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gg",
		"description": "&#x226B; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\ggg",
		"description": "&#x22D9;\n\nclass REL\n\n&#x22D9;class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gimel",
		"description": "&#x2137; \u00a0\nclass ORD\nHebrew letter gimel",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gtrapprox",
		"description": "&#x2A86;class REL\n&#x2A8A;class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gneq",
		"description": "&#x2A88;class REL\n&#x2269;class REL\n&#x2269;class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gtrsim",
		"description": "&#x2273;class REL\n&#x22E7;class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\grave",
		"description": "&#x02CB;\ngrave accent\n\\grave #1\nUsually, #1 is a single letter; \u00a0otherwise, accent is centered over argument.",
		"examples": [
			"\\grave e",
			"\\grave E",
			"\\grave eu",
			"\\grave{eu}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gt",
		"description": "&#x003E; \u00a0 class REL\ngreater than",
		"examples": "",
		"see_also": [
			"\\ngtr"
		],
		"snippet": ""
	},
	{
		"name": "\\gtrdot",
		"description": "&#x22D7; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gtreqless",
		"description": "&#x22DB;class REL\n&#x2A8C;class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\gtrless",
		"description": "&#x2277; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\hat",
		"description": "&#x02CA;\nnon-stretchy hat accent\n\\hat #1\nUsually, #1 is a single letter; \u00a0otherwise, accent is centered over argument.",
		"examples": [
			"\\hat\\imath",
			"\\hat\\jmath",
			"\\hat ab",
			"\\hat{ab}"
		],
		"see_also": [
			"\\widehat"
		],
		"snippet": ""
	},
	{
		"name": "\\hbar",
		"description": "&#x210F; \u00a0\nclass ORD\nPlanck's constant",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\hbox",
		"description": "class ORD\nhorizontal box;\ncontents are treated as text, but you can switch to math mode inside;\ntext appears in \u00a0\\rm\u00a0\n\\hbox #1",
		"examples": [
			"\\hbox{\\alpha a }\\alpha a",
			"\\hbox{This is a sentence.}",
			"\\hbox{for all $x > 0$}"
		],
		"see_also": [
			"\\rm"
		],
		"snippet": ""
	},
	{
		"name": "\\hdashline",
		"description": "works in many of the environments\nto create a horizontal line (\\hline), or a horizontal dashed line (\\hdashline)\n\nPutting \u00a0 \\hdashline \u00a0 or \u00a0 \\hline \u00a0 first or last encases the entire structure\n(which is different from standard $\\,\\rm\\LaTeX\\,$ behavior):\n\n\\begin{matrix}\n\\hdashline\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\\\\nx_{31} & x_{32}\n\\end{matrix}\n\nyields\n\n$\n\\begin{matrix}\n\\hdashline\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\\\\nx_{31} & x_{32}\n\\end{matrix}\n$\n\n\\begin{matrix}\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\\\\nx_{31} & x_{32} \\\\\n\\hline\n\\end{matrix}\n\nyields\n\n$\n\\begin{matrix}\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\\\\nx_{31} & x_{32} \\\\\n\\hline\n\\end{matrix}\n$\n\nPutting \u00a0 \\hdashline \u00a0 or \u00a0 \\hline \u00a0 at the beginning of any subsequent row puts a line over that row:\n\n\\begin{matrix}\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\\\\n\\hline\nx_{31} & x_{32}\n\\end{matrix}\n\nyields\n\n$\n\\begin{matrix}\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\\\\n\\hline\nx_{31} & x_{32}\n\\end{matrix}\n$\n\nYou can combine effects, and put in struts (as desired) for additional vertical spacing:\n\n\\begin{matrix}\n\\hline\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\strut \\\\\n\\hdashline\nx_{31} & x_{32} \\strut\n\\end{matrix}\n\nyields\n\n$\n\\begin{matrix}\n\\hline\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\strut \\\\\n\\hdashline\nx_{31} & x_{32} \\strut\n\\end{matrix}\n$",
		"examples": [
			"\n\\begin{matrix}\n\\hdashline\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\\\\nx_{31} & x_{32}\n\\end{matrix}\n",
			"\n\\begin{matrix}\nx_{11} & x_{12} \\\\\nx_{21} & x_{22} \\\\\nx_{31} & x_{32} \\\\\n\\hline\n\\end{matrix}\n"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\heartsuit",
		"description": "&#x2661; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [
			"\\clubsuit",
			"\\diamondsuit",
			"\\spadesuit"
		],
		"snippet": ""
	},
	{
		"name": "\\hfil",
		"description": "horizontal glue; horizontal fill (added in MathJax 2.5);\ncan be used to set horizontal alignment in matrices and arrays (as in old-fashioned $\\,\\TeX\\,$ layout);\nit \u2018expands\u2019 to fill available horizontal space, pushing contents on right or left to the boundary",
		"examples": "",
		"see_also": [
			"\\hskip",
			"\\hspace",
			"\\kern",
			"\\mkern",
			"\\mskip",
			"\\mspace"
		],
		"snippet": ""
	},
	{
		"name": "\\hom",
		"description": "class OP\nhomomorphism;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\hookleftarrow",
		"description": "&#x21A9;non-stretchy\n&#x21AA;non-stretchy\n\nboth class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\hphantom",
		"description": "class ORD\nhorizontal phantom\n\nSometimes you want to pretend that something is there, for spacing reasons,\nbut you don't want it to appear\u2014you want it to be invisible\u2014you want it to be a phantom.\n\nThe box created by \u00a0 \\hphantom \u00a0 has the width of its argument,\nbut its height and depth are zero (so it doesn't contribute to any vertical spacing issues).\nIn other words, \\hphantom \u00a0 creates horizontal space equal to that produced by its argument,\nbut doesn't create any vertical space.\n\\hphantom #1",
		"examples": "",
		"see_also": [
			"\\phantom",
			"\\vphantom"
		],
		"snippet": ""
	},
	{
		"name": "\\href",
		"description": "used to make a math object into a link\n\\href{ <url> } #1\nwhere the argument (#1) is the clickable area",
		"examples": [
			"\\href{http://www.onemathematicalcat.org}{M^{A^{T^H}}}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\hskip",
		"description": "horizontal glue; horizontal space; horizontal skipping;\n\\hskip <dimen>",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\hslash",
		"description": "&#x210F; \u00a0\nclass ORD\nperhaps an alternative form of Planck's constant",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\hspace",
		"description": "horizontal glue; horizontal space; horizontal skipping\n\\hspace <dimen>",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Huge",
		"description": "both class ORD\nturns on huge mode and an even bigger Huge mode\n\n{\\Huge ... }\n{\\huge ... }",
		"examples": [
			"\\huge AaBb\\alpha\\beta123\\frac ab\\sqrt x",
			"{\\huge A B} A B",
			"A\\alpha\\huge A\\alpha \\Huge A\\alpha"
		],
		"see_also": [
			"\\LARGE, \\Large, \\large"
		],
		"snippet": ""
	},
	{
		"name": "\\iddots",
		"description": "inner diagonal dots;\n\nThis macro must be supplied by the user, if desired.\nDavide Cervone provided the code (given here) in the\nMathJax User Group.\n\nTo use this macro, put the following definition in either inline or display mathematics:\n\n$\n\\def\\iddots{\n{\\kern3mu\\raise1mu{.}\\kern3mu\\raise6mu{.}\\kern3mu\\raise12mu{.}}}\n$ \n\nThen, in any subsequent mathematics:\n\n\\iddots\nyields\n\n$\\iddots$\n\nInstead of providing the definition inside math delimiters in the body,\nyou can add the definition to your configuration using the \u00a0Macros\u00a0 property of\nthe \u00a0TeX\u00a0 block:\n\n<script type=\"text/x-mathjax-config\">\nMathJax.Hub.Config({\nTeX: {\nMacros: {\niddots: \"{\\\\kern3mu\\\\raise1mu{.}\\\\kern3mu\\\\raise6mu{.}\\\\kern3mu\\\\raise12mu{.}}\"\n}}});\n</script>",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\idotsint",
		"description": "class OP\nchanges size;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\iff",
		"description": "&#x27FA; \u00a0 with a thick space on both sides\nif and only if; \u00a0 is equivalent to;\nnon-stretchy",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\iiiint",
		"description": "four occurrences of &#x222B;\u00a0\n&#x222D;\n&#x222C;\n&#x222B;\n\nall class OP;\nsee the Big Operators Table for examples\n\nCompare the different limit placements (both in display mode):\n\n\\int_a^byields$$\\int_a^b$$\n\\intop_a^byields$$\\intop_a^b$$",
		"examples": [
			"\\int_a^b",
			"\\intop_a^b"
		],
		"see_also": [
			"\\intop"
		],
		"snippet": ""
	},
	{
		"name": "\\intop",
		"description": "&#x222B; (with movable limits) \u00a0\nclass OP\n\nSee the Big Operators Table for examples.",
		"examples": "",
		"see_also": [
			"\\iiiint, \\iiint, \\iint, \\int"
		],
		"snippet": ""
	},
	{
		"name": "\\Im",
		"description": "&#x2111; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\imath",
		"description": "&#x0131; \u00a0\nclass ORD\n\na dotless \u2018i\u2019;\nbetter to use when accented",
		"examples": [
			"\\hat i",
			"\\hat\\imath"
		],
		"see_also": [
			"\\jmath"
		],
		"snippet": ""
	},
	{
		"name": "\\impliedby",
		"description": "&#x27F8; \u00a0 with a thick space on both sides\nnon-stretchy",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\implies",
		"description": "&#x27F9; \u00a0 with a thick space on both sides\nnon-stretchy",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\in",
		"description": "&#x2208; \u00a0\nclass REL\nis in; \u00a0 is an element of; \u00a0 indicates membership in a set;",
		"examples": "",
		"see_also": [
			"\\ni",
			"\\notin",
			"\\owns"
		],
		"snippet": ""
	},
	{
		"name": "\\inf",
		"description": "class OP\ninfimum; \u00a0\ngreatest lower bound;\ndoes not change size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples",
		"examples": [
			"\\inf_{\\rm limit}",
			"\\inf_{\\rm limit}"
		],
		"see_also": [
			"\\sup"
		],
		"snippet": ""
	},
	{
		"name": "\\infty",
		"description": "&#x221E; \u00a0\nclass ORD\ninfinity",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\injlim",
		"description": "class OP\ninjective limit;\ndoes not change size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [
			"\\varinjlim"
		],
		"snippet": ""
	},
	{
		"name": "\\intercal",
		"description": "&#x22BA; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\iota",
		"description": "&#x03B9; \u00a0\nclass ORD\nlowercase Greek letter iota",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\it",
		"description": "class ORD\nturns on math italic mode;\nto return to math italic mode if it had been turned off\n{\\it ... }",
		"examples": [
			"{\\bf ab \\it ab} ab",
			"\\rm for\\ all\\ {\\it x}\\ in\\ \\Bbb R",
			"\\Delta\\Gamma\\Lambda{\\it \\Delta\\Gamma\\Lambda}"
		],
		"see_also": [
			"\\mathit",
			"\\mit"
		],
		"snippet": ""
	},
	{
		"name": "\\jmath",
		"description": "&#x0237; \u00a0\nclass ORD\na dotless \u2018j\u2019;\nbetter to use when accented",
		"examples": [
			"\\hat j",
			"\\hat\\jmath"
		],
		"see_also": [
			"\\imath"
		],
		"snippet": ""
	},
	{
		"name": "\\Join",
		"description": "&#x22C8; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\kappa",
		"description": "&#x03BA; \u00a0\nclass ORD\n\nlowercase Greek letter kappa",
		"examples": "",
		"see_also": [
			"\\varkappa"
		],
		"snippet": ""
	},
	{
		"name": "\\ker",
		"description": "class OP\nkernel;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\kern",
		"description": "to get a specified amount of horizontal space;\na negative argument forces \u2018backing up\u2019, so items can overlap\n\\kern <dimen>",
		"examples": [
			"|\\kern 2ex|\\kern 2em|\\kern 2pt|",
			"\\rm I\\kern-2.5pt R"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Lambda",
		"description": "uppercase Greek letter lambda\n\n&#x039B; \u00a0\nclass ORD\n\nlowercase Greek letter lambda\n\n&#x03BB; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [
			"\\varLambda"
		],
		"snippet": ""
	},
	{
		"name": "\\lambda",
		"description": "uppercase Greek letter lambda\n\n&#x039B; \u00a0\nclass ORD\n\nlowercase Greek letter lambda\n\n&#x03BB; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [
			"\\varLambda"
		],
		"snippet": ""
	},
	{
		"name": "\\land",
		"description": "logical AND\n\n&#x2227; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [
			"\\lor",
			"\\wedge"
		],
		"snippet": ""
	},
	{
		"name": "\\langle",
		"description": "left angle bracket;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\n&#x27E8; \u00a0\nclass OPEN",
		"examples": [
			"\n\\left\\langle\n\\matrix{a & b\\cr c & d}\n\\right\\rangle\n"
		],
		"see_also": [
			"\\rangle"
		],
		"snippet": ""
	},
	{
		"name": "\\LARGE",
		"description": "turns on large typestyles; affects all math\n\nall class ORD\n\n{\\LARGE ... }\n{\\Large ... }\n{\\large ... }",
		"examples": [
			"\\Large AaBb\\alpha\\beta123\\frac ab",
			"{\\Large A B} A B",
			"AB \\large AB \\Large AB \\LARGE AB",
			"\\Large{AB}CD"
		],
		"see_also": [
			"\\huge, \\Huge"
		],
		"snippet": ""
	},
	{
		"name": "\\LaTeX",
		"description": "the LaTeX logo\n\nclass ORD",
		"examples": "",
		"see_also": [
			"\\TeX"
		],
		"snippet": ""
	},
	{
		"name": "\\lbrace",
		"description": "left brace:\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\nclass OPEN",
		"examples": [
			"\\lbrace \\frac ab, c \\rbrace",
			"\\left\\lbrace \\frac ab, c \\right\\rbrace"
		],
		"see_also": [
			"\\rbrace",
			"\\{ \\}"
		],
		"snippet": ""
	},
	{
		"name": "\\lbrack",
		"description": "left bracket:\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below);\n\nclass OPEN",
		"examples": [
			"\\lbrack \\frac ab, c \\rbrack",
			"\\left\\lbrack \\frac ab, c \\right\\rbrack"
		],
		"see_also": [
			"\\rbrack",
			"[\u00a0]"
		],
		"snippet": ""
	},
	{
		"name": "\\lceil",
		"description": "left ceiling;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\n&#x2308; \u00a0\nclass OPEN",
		"examples": [
			"\n\\left\\lceil\n\\matrix{a & b\\cr c & d}\n\\right\\rceil\n"
		],
		"see_also": [
			"\\rceil",
			"\\lfloor",
			"\\rfloor"
		],
		"snippet": ""
	},
	{
		"name": "\\ldotp",
		"description": "lower dot, punctuation symbol\n\n&#x002E; \u00a0\nclass PUNCT",
		"examples": [
			"\\rm s \\ldotp h",
			"\\rm s.h"
		],
		"see_also": [
			"\\cdotp"
		],
		"snippet": ""
	},
	{
		"name": "\\ldots",
		"description": "lower dots; \u00a0 ellipsis; \u00a0 ellipses; \u00a0 dot dot dot\n\n&#x2026; \u00a0\nclass INNER",
		"examples": "",
		"see_also": [
			"\\cdots",
			"\\dots"
		],
		"snippet": ""
	},
	{
		"name": "\\le",
		"description": "less than or equal to&#x2264; \u00a0 class REL\nless than or equal to&#x2264; \u00a0 class REL\nless than or equal to&#x2266; \u00a0 class REL\nless than or equal to&#x2A7D; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\nleq",
			"\\nleqq",
			"\\nleqslant"
		],
		"snippet": ""
	},
	{
		"name": "\\leadsto",
		"description": "&#x21DD; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\left",
		"description": "used for stretchy delimiters;\nsee the Variable-Sized Delimiters Table for details",
		"examples": [
			"\\left( \\frac12 \\right)",
			"\\left\\updownarrow \\phantom{\\frac12} \\right\\Updownarrow"
		],
		"see_also": [
			"\\right"
		],
		"snippet": ""
	},
	{
		"name": "\\leftarrow",
		"description": "left arrow; non-stretchy\n\n&#x2190; \u00a0\nclass REL\n\nleft arrow; non-stretchy\n\n&#x21D0; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\nleftarrow",
			"\\nLeftarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\leftarrowtail",
		"description": "left arrow tail; non-stretchy\n\n&#x21A2; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\rightarrowtail"
		],
		"snippet": ""
	},
	{
		"name": "\\leftharpoondown",
		"description": "left harpoon arrow; non-stretchy\n\n&#x21BD; \u00a0\nclass REL\n\nleft harpoon arrow; non-stretchy\n\n&#x21BC; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\leftleftarrows",
		"description": "left left arrows; non-stretchy\n\n&#x21C7; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\leftrightarrow",
		"description": "left right arrow; non-stretchy\n\n&#x2194; \u00a0\nclass REL\n\nleft right arrow; non-stretchy\n\n&#x21D4; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\nleftrightarrow",
			"\\nLeftrightarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\leftrightarrows",
		"description": "left right arrows; non-stretchy\n\n&#x21C6; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\leftrightharpoons",
		"description": "left right harpoons; non-stretchy\n\n&#x21CB; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\leftrightsquigarrow",
		"description": "left right squiqqle arrow; non-stretchy\n\n&#x21AD; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\leftroot",
		"description": "used to fine-tune the placement of the index inside\n\u00a0 \\sqrt \u00a0 or \u00a0 \\root \u00a0 (see examples)\n\n\\sqrt[... \\leftroot #1 ...]{...}\n\\root ... \\leftroot #1 ... \\of {...}\n\nwhere the argument is a small integer:\na positive integer moves the index to the left;\na negative integer moves the index to the right",
		"examples": [
			"\\sqrt[3]{x}",
			"\\sqrt[3\\leftroot1]{x}",
			"\\root 3 \\of x",
			"\\root 3\\leftroot{-1} \\of x",
			"\\root 3\\leftroot{-1}\\uproot2 \\of x"
		],
		"see_also": [
			"\\uproot",
			"\\root"
		],
		"snippet": ""
	},
	{
		"name": "\\leftthreetimes",
		"description": "&#x22CB; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\leqalignno",
		"description": "equation alignment with optionally numbered (tagged) lines;\nin $\\rm\\TeX$, \u00a0\\leqalignno\u00a0 puts the tags on the left, but MathJax\ndoesn't implement this behavior;\ncurrently, tags appear in a column on the\nright separated from the equations by a fixed amount of space (so they\ndon't work like tags in the AMS math environments);\nthis may be fixed in a future version of MathJax\n\\leqalignno{ <math> & <math> & <equation tag> \\cr <repeat as needed> }\nthe first ampersand is placed where alignment is desired;\nthe second ampersand is used just before a tag;\nif there is no tag, then the final  \u00a0 & <equation tag> \u00a0 is omitted;\na double-backslash can be used in place of the \u00a0\\cr\u00a0;\nthe final \u00a0 \\\\ \u00a0 or \u00a0 \\cr \u00a0 is optional;\noutput is the same in both inline and display modes\n(except for the amount of vertical space before and after);",
		"examples": "",
		"see_also": [
			"\\eqalignno",
			"align environment"
		],
		"snippet": ""
	},
	{
		"name": "\\lessapprox",
		"description": "",
		"examples": "",
		"see_also": [
			"\\lnapprox",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\lessdot",
		"description": "&#x22D6; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\lesseqgtr",
		"description": "&#x22DA; \u00a0\nclass REL\n\n&#x2A8B; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\lessgtr",
		"description": "&#x2276; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\lesssim",
		"description": "",
		"examples": "",
		"see_also": [
			"\\lnsim",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\lfloor",
		"description": "left floor;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n&#x230A; \u00a0\nclass OPEN",
		"examples": "",
		"see_also": [
			"\\rfloor",
			"\\lceil",
			"\\rceil"
		],
		"snippet": ""
	},
	{
		"name": "\\lg",
		"description": "does not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\lgroup",
		"description": "left group;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n&#x27EE; \u00a0\nclass OPEN",
		"examples": [
			"\n\\left\\lgroup\n\\matrix{a & b\\cr c & d}\n\\right\\rgroup\n"
		],
		"see_also": [
			"\\rgroup"
		],
		"snippet": ""
	},
	{
		"name": "\\lhd",
		"description": "left-hand diamond\n\n&#x22B2; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\rhd"
		],
		"snippet": ""
	},
	{
		"name": "\\lim",
		"description": "limit;\ndoes not change size;\ncan change limit placement using \u00a0\\limits\u00a0 and\n\u00a0\\nolimits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": [
			"\\lim_{n\\rightarrow\\infty} f(x) = \\ell",
			"\\lim_{n\\rightarrow\\infty} f(x) = \\ell"
		],
		"see_also": [],
		"snippet": "\\lim_{@1@ \\rightarrow @2@} @3@ = @4@"
	},
	{
		"name": "\\liminf",
		"description": "limit inferior;\ndoes not change size;\ncan change limit placement using \u00a0\\limits\u00a0 and\n\u00a0\\nolimits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": [
			"\\liminf_{n\\rightarrow\\infty} x_n = \\ell",
			"\\liminf_{n\\rightarrow\\infty}\\ x_n = \\ell"
		],
		"see_also": [
			"\\varliminf"
		],
		"snippet": ""
	},
	{
		"name": "\\limits",
		"description": "used to set limits above/below any token of class OP;\nsee the Big Operators table for more information and examples",
		"examples": [
			"\\int_a^b f(x)\\,dx",
			"\\int\\limits_a^b f(x)\\,dx",
			"\\int_a^b f(x)\\,dx",
			"\\int\\limits_a^b f(x)\\,dx",
			"\\mathop{x}\\limits_0^1"
		],
		"see_also": [
			"\\nolimits"
		],
		"snippet": ""
	},
	{
		"name": "\\limsup",
		"description": "limit superior;\ndoes not change size;\ncan change limit placement using \u00a0\\limits\u00a0 and\n\u00a0\\nolimits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": [
			"\\limsup_{n\\rightarrow\\infty} x_n",
			"\\limsup_{n\\rightarrow\\infty}\\ x_n"
		],
		"see_also": [
			"\\varlimsup"
		],
		"snippet": ""
	},
	{
		"name": "\\ll",
		"description": "&x226A; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\llap",
		"description": "left overlap\n\nclass ORD\n\n\\llap #1\n\ncreates a box of width zero;\nthe argument is then placed just to the left of this zero-width box\n(and hence will overlap whatever lies to the left);\nproper use of \u00a0\\llap\u00a0 and \u00a0\\rlap\u00a0 in math expressions is somewhat delicate",
		"examples": [
			"a\\mathrel{{=}\\llap{/}}b",
			"{=}",
			"REL",
			"ORD",
			"REL",
			"a\\mathrel{{=}\\llap{/\\,}}b",
			"\\,",
			"a=\\mathrel{\\llap{/\\,}}b",
			"REL"
		],
		"see_also": [
			"\\rlap"
		],
		"snippet": ""
	},
	{
		"name": "\\llcorner",
		"description": "lower left corner&#x2514; \u00a0 class REL\nlower right corner&#x2518; \u00a0 class REL\n\nThese are technically delimiters, but MathJax doesn't stretch them like it should.",
		"examples": "",
		"see_also": [
			"\\ulcorner",
			"\\urcorner"
		],
		"snippet": ""
	},
	{
		"name": "\\Lleftarrow",
		"description": "non-stretchy\n\n&#x21DA; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\lll",
		"description": "&#x22D8; \u00a0\nclass REL\n\n&#x22D8; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\lmoustache",
		"description": "left moustache;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\n&#x23B0; \u00a0\nclass OPEN",
		"examples": [
			"\n\\left\\lmoustache\n\\phantom{\\matrix{a & b\\cr c & d}}\n\\right\\rmoustache\n"
		],
		"see_also": [
			"\\rmoustache"
		],
		"snippet": ""
	},
	{
		"name": "\\ln",
		"description": "natural logarithm;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\lnapprox",
		"description": "",
		"examples": "",
		"see_also": [
			"\\lessapprox",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\lneq",
		"description": "",
		"examples": "",
		"see_also": [
			"\\leq",
			"REL",
			"\\leqq",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\lnot",
		"description": "logical not\n\n&#x00AC; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [
			"\\neg"
		],
		"snippet": ""
	},
	{
		"name": "\\lnsim",
		"description": "",
		"examples": "",
		"see_also": [
			"\\lesssim",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\log",
		"description": "logarithm;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\longleftarrow",
		"description": "non-stretchy\n\n&#x27F5; \u00a0\nclass REL\n\nnon-stretchy\n\n&#x27F8; \u00a0\nclass REL\n\nnon-stretchy\n\n&#x27F6; \u00a0\nclass REL\n\nnon-stretchy\n\n&#x27F9; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\longleftrightarrow",
		"description": "non-stretchy\n\n&#x27F7; \u00a0\nclass REL\n\nnon-stretchy\n\n&#x27FA; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\longmapsto",
		"description": "long maps to\n\n&#x27FC; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\mapsto"
		],
		"snippet": ""
	},
	{
		"name": "\\looparrowleft",
		"description": "non-stretchy\n\n&#x21AB; \u00a0\nclass REL\n\nnon-stretchy\n\n&#x21AC; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\lor",
		"description": "logical OR\n\n&#x2228; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [
			"\\land",
			"\\vee"
		],
		"snippet": ""
	},
	{
		"name": "\\lower",
		"description": "\\lower <dimen> #1\nlowers the argument by the amount specified in <dimen>;\nin actual $\\rm\\TeX$, the argument to \u00a0\\lower\u00a0 (and \u00a0\\raise\u00a0) must be an\n\u00a0\\hbox\u00a0,\nbut in MathJax it can be any expression (using an \\hbox is allowed, but not required)",
		"examples": [
			"l\\lower 2pt {owe} r"
		],
		"see_also": [
			"\\raise"
		],
		"snippet": ""
	},
	{
		"name": "\\lozenge",
		"description": "&#x25CA; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Lsh",
		"description": "left shift; non-stretchy\n\n&#x21B0; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\Rsh"
		],
		"snippet": ""
	},
	{
		"name": "\\lt",
		"description": "less than\n\n&#x003C; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\nless"
		],
		"snippet": ""
	},
	{
		"name": "\\ltimes",
		"description": "",
		"examples": "",
		"see_also": [
			"\\rtimes",
			"BIN"
		],
		"snippet": ""
	},
	{
		"name": "\\lvert",
		"description": "both non-stretchy when used alone;\n\n&#x2223; \u00a0\nclass OPEN\n\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n&#x2225; \u00a0\nclass OPEN",
		"examples": [
			"\\left\\lvert\\frac{\\frac ab}{\\frac cd}\\right\\rvert"
		],
		"see_also": [
			"\\rvert",
			"\\rVert",
			"|",
			"\\|"
		],
		"snippet": ""
	},
	{
		"name": "\\lvertneqq",
		"description": "&#x2268; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\maltese",
		"description": "&#x2720; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mapsto",
		"description": "maps to; non-stretchy math operator\n\n&#x21A6; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\longmapsto"
		],
		"snippet": ""
	},
	{
		"name": "\\mathbb",
		"description": "blackboard-bold for uppercase letters and lowercase \u2018k\u2019;\nif lowercase blackboard-bold letters are not available, then they are typeset in a roman font\n\nclass ORD\n\n\\mathbb #1\nWhether lower-case letters are displayed in blackboard-bold, or not, depends on the fonts being used.\nThe MathJax web-based fonts don't have lowercase blackboard-bold, but the STIX fonts do;\nso users with the STIX fonts installed will be able to display lowercase blackboard-bold letters.",
		"examples": [
			"\\mathbb R",
			"\\mathbb ZR",
			"\\mathbb{AaBbKk}Cc",
			"\\mathbb{ABCDEFGHIJKLMNOPQRSTUVWXYZ}"
		],
		"see_also": [
			"\\Bbb"
		],
		"snippet": ""
	},
	{
		"name": "\\mathbf",
		"description": "boldface for uppercase and lowercase letters and digits\n\nclass ORD\n\n\\mathbf #1",
		"examples": [
			"\\mathbf{AaBb\\alpha\\beta123}",
			"\\mathbf ZR",
			"\\mathbf{uvw}xyz"
		],
		"see_also": [
			"\\bf",
			"\\boldsymbol"
		],
		"snippet": ""
	},
	{
		"name": "\\mathbin",
		"description": "gives the correct spacing to make an object into a binary operator;\nbinary operators have some extra space around them;\ncreates an element of class BIN\n\nclass BIN\n\n\\mathbin #1",
		"examples": [
			"a\\text{op} b",
			"a\\mathbin{\\text{op}} b",
			"a\\Diamond b",
			"a\\mathbin{\\Diamond}b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathcal",
		"description": "calligraphic font for uppercase letters and digits\n\nclass ORD\n\n\\mathcal #1",
		"examples": [
			"\\mathcal{ABCDEFGHIJKLMNOPQRSTUVWXYZ}",
			"\\mathcal{0123456789}",
			"\\mathcal{abcdefghijklmnopqrstuvwxyz}",
			"abcdefghijklmnopqrstuvwxyz",
			"\\mathcal{AB}AB"
		],
		"see_also": [
			"\\cal",
			"\\oldstyle"
		],
		"snippet": ""
	},
	{
		"name": "\\mathchoice",
		"description": "provides content that is dependent on the current style (display, text, script, or scriptscript);\ncan be used in defining a macro for general use\n\\mathchoice #1 #2 #3 #4\nwhere:\n\n#1 is rendered when the \u00a0\\mathchoice\u00a0 appears in display style\n#2 is rendered when the \u00a0\\mathchoice\u00a0 appears in text style\n#3 is rendered when the \u00a0\\mathchoice\u00a0 appears in script style\n#4 is rendered when the \u00a0\\mathchoice\u00a0 appears in scriptscript style",
		"examples": [
			"\\mathchoice{D}{T}{S}{SS} \u00a0 (in display style)",
			"\\mathchoice{D}{T}{S}{SS} \u00a0 (in text style)",
			"\\mathchoice{D}{T}{S}{SS} \u00a0 (in script style)",
			"\\mathchoice{D}{T}{S}{SS} \u00a0 (in scriptscript style)"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathclose",
		"description": "forces the argument to be treated in the \u2018closing\u2019 class; \u00a0 for example, like \u2018$)$\u2019 and \u2018$]$\u2019;\ncreates an element of class CLOSE\n\nclass CLOSE\n\n\\mathclose #1",
		"examples": [
			"a + \\lt b\\gt + c",
			"a + \\mathopen\\lt b\\mathclose\\gt + c"
		],
		"see_also": [
			"\\mathopen"
		],
		"snippet": ""
	},
	{
		"name": "\\mathfrak",
		"description": "fraktur font for uppercase and lowercase letters and digits\n(and a few other characters)\n\nclass ORD\n\n\\mathfrak #1",
		"examples": [
			"\\mathfrak{ABCDEFGHIJKLMNOPQRSTUVWXYZ}",
			"\\mathfrak{0123456789}",
			"\\mathfrak{abcdefghijklmnopqrstuvwxyz}",
			"\\mathfrak{AB}AB"
		],
		"see_also": [
			"\\frak"
		],
		"snippet": ""
	},
	{
		"name": "\\mathinner",
		"description": "some constructions are meant to appear \u2018inside\u2019 other formulas,\nand should be surrounded by additional space in certain circumstances;\nthis classification is forced on the argument by using \\mathinner\n\nclass INNER\n\n\\mathinner #1",
		"examples": [
			"ab\\text{inside}cd",
			"ab\\mathinner{\\text{inside}}cd"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathit",
		"description": "math italic mode\n\nclass ORD\n\n\\mathit #1",
		"examples": [
			"\\rm abc \\mathit{def} ghi"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathop",
		"description": "forces the argument to be treated in the \u2018large operator\u2019 class; \u00a0 for example, like \u2018$\\sum$\u2019;\ncreates an element of class OP\n\nclass OP\n\n\\mathop #1",
		"examples": [
			"atbtc",
			"a\\mathop{t}b\\mathop{t}c",
			"\\star_a^b",
			"\\mathop{\\star}_a^b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathopen",
		"description": "forces the argument to be treated in the \u2018opening\u2019 class; \u00a0 for example, like \u2018$($\u2019 and \u2018$[$\u2019;\ncreates an element of class OPEN\n\nclass OPEN\n\n\\mathopen #1",
		"examples": [
			"a + \\lt b\\gt + c",
			"a + \\mathopen\\lt b\\mathclose\\gt + c"
		],
		"see_also": [
			"\\mathclose"
		],
		"snippet": ""
	},
	{
		"name": "\\mathord",
		"description": "forces the argument to be treated in the \u2018ordinary\u2019 class; \u00a0 for example, like \u2018$/$\u2019;\nspacing is determined by pairs of tokens;\nthere is no extra spacing between adjacent ORD's (as in the second example below);\nthere is extra spacing between an \u00a0ORD\u00a0 and a \u00a0BIN\u00a0 (as in the first example below);\ncreates an element of class ORD\n\nclass ORD\n\n\\mathord #1",
		"examples": [
			"a+b+c",
			"a\\mathord{+}b\\mathord{+}c",
			"1,234,567",
			"1\\mathord{,}234{,}567"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathpunct",
		"description": "forces the argument to be treated in the \u2018punctuation\u2019 class; \u00a0 for example, like \u2018$,$\u2019;\npunctuation tends to have some extra space after the symbol;\nreturns an element of class PUNCT\n\nclass PUNCT\n\n\\mathpunct #1",
		"examples": [
			"1.234",
			"1\\mathpunct{.}234"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathrel",
		"description": "forces the argument to be treated in the \u2018relation\u2019 class; \u00a0 for example, like \u2018$=$\u2019 and \u2018$\\gt$\u2019;\nrelations have a bit more space on both sides than binary operators;\nreturns an element of class REL\n\nclass REL\n\n\\mathrel #1",
		"examples": [
			"a \\# b",
			"a \\mathrel{\\#} b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathring",
		"description": "&#x2DA;\n\n\\mathring #1",
		"examples": [
			"\\mathring A",
			"\\mathring{AB}C"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathrm",
		"description": "roman typestyle for uppercase and lowercase letters\n\nclass ORD\n\n\\mathrm #1",
		"examples": [
			"\\mathrm{AaBb\\alpha\\beta123}",
			"\\mathrm ZR",
			"\\mathrm{uvw}xyz"
		],
		"see_also": [
			"\\rm"
		],
		"snippet": ""
	},
	{
		"name": "\\mathscr",
		"description": "script typestyle for uppercase letters;\nif lowercase script letters are not available, then they are typeset in a roman typestyle\n\nclass ORD\n\n\\mathscr #1\nWhether lower-case letters are displayed in script, or not, depends on the fonts being used.\nThe MathJax web-based fonts don't have lowercase script, but the STIX fonts do;\nso users with the STIX fonts installed will be able to display lowercase script letters.",
		"examples": [
			"\\mathscr{ABCDEFGHIJKLMNOPQRSTUVWXYZ}",
			"\\mathscr{0123456789}",
			"\\mathscr{abcdefghijklmnopqrstuvwxyz}",
			"abcdefghijklmnopqrstuvwxyz",
			"\\mathscr{AB}AB"
		],
		"see_also": [
			"\\scr"
		],
		"snippet": ""
	},
	{
		"name": "\\mathsf",
		"description": "sans serif typestyle for uppercase and lowercase letters and digits;\nalso affects uppercase greek (as do the other font switches,\nlike \\rm,\n\\it,\n\\bf,\n\\mathrm,\n\\mathit,\n\\mathbf, etc).\n\nclass ORD\n\n\\mathsf #1",
		"examples": [
			"\\mathsf{ABCDEFGHIJKLMNOPQRSTUVWXYZ}",
			"\\mathsf{0123456789}",
			"\\mathsf{abcdefghijklmnopqrstuvwxyz}",
			"\\Delta\\Gamma\\Lambda\\mathsf{\\Delta\\Gamma\\Lambda}",
			"abcdefghijklmnopqrstuvwxyz",
			"\\mathsf{AB}AB"
		],
		"see_also": [
			"\\sf"
		],
		"snippet": ""
	},
	{
		"name": "\\mathstrut",
		"description": "an invisible box whose width is zero;\nits height and depth are the same as a parenthesis \u2018$($\u2019;\ncan be used to achieve more uniform appearance in adjacent formulas\n\nclass ORD",
		"examples": [
			"\\sqrt3 + \\sqrt\\alpha",
			"\\sqrt{\\mathstrut 3} + \\sqrt{\\mathstrut\\alpha}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mathtt",
		"description": "typewriter typestyle for uppercase and lowercase letters and digits;\nalso affects uppercase Greek\n\nclass ORD\n\n\\mathtt #1",
		"examples": [
			"\\mathtt{ABCDEFGHIJKLMNOPQRSTUVWXYZ}",
			"\\mathtt{0123456789}",
			"\\mathtt{abcdefghijklmnopqrstuvwxyz}",
			"abcdefghijklmnopqrstuvwxyz",
			"\\Delta\\Gamma\\Lambda\\mathtt{\\Delta\\Gamma\\Lambda}",
			"\\mathtt{AB}AB"
		],
		"see_also": [
			"\\tt"
		],
		"snippet": ""
	},
	{
		"name": "\\matrix",
		"description": "matrix (without any delimiters)\n\\matrix{ <math> & <math> ... \\cr <repeat as needed> }\nalignment occurs at the ampersands;\na double-backslash can be used in place of the \u00a0\\cr\u00a0;\nthe final \u00a0 \\\\ \u00a0 or \u00a0 \\cr \u00a0 is optional",
		"examples": [
			"\n\\matrix{ a & b \\cr c & d }\n"
		],
		"see_also": [
			"\\array"
		],
		"snippet": ""
	},
	{
		"name": "\\max",
		"description": "maximum;\ndoes not change size;\ncan change limit placement using \u00a0\\limits\u00a0 and\n\u00a0\\nolimits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": [
			"\\max_{\\rm sub}",
			"\\max_{\\rm sub}"
		],
		"see_also": [
			"\\min"
		],
		"snippet": ""
	},
	{
		"name": "\\mbox",
		"description": "creates a box just wide enough to hold the text in its argument;\nno linebreaks are allowed in the text;\ntext appears in \u00a0\\rm\u00a0\n\nclass ORD\n\n\\mbox <text argument>",
		"examples": [
			"a + b \\mbox{ (are you paying attention?) } = c",
			"a + b \\text{ (are you paying attention?) } = c"
		],
		"see_also": [
			"\\rm"
		],
		"snippet": ""
	},
	{
		"name": "\\measuredangle",
		"description": "&#x2221; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mho",
		"description": "&#x2127; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mid",
		"description": "the spacing is perfect for use in set-builder notation\n\n&#x2223; \u00a0\nclass REL",
		"examples": [
			"\\{x | x\\gt 1\\}",
			"\\{x \\mid x\\gt 1\\}"
		],
		"see_also": [
			"\\nmid",
			"\\shortmid",
			"\\nshortmid"
		],
		"snippet": ""
	},
	{
		"name": "\\min",
		"description": "minimum;\ndoes not change size;\ncan change limit placement using \u00a0\\limits\u00a0 and\n\u00a0\\nolimits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": [
			"\\min_{\\rm sub}",
			"\\min_{\\rm sub}"
		],
		"see_also": [
			"\\max"
		],
		"snippet": ""
	},
	{
		"name": "\\mit",
		"description": "math italic typestyle\n\nclass ORD\n\n\\mit #1",
		"examples": [
			"\\mit{\\Gamma\\Delta\\Theta\\Omega}",
			"\\mathit{\\Gamma\\Delta\\Theta\\Omega}",
			"\\Gamma\\Delta\\Theta\\Omega"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mkern",
		"description": "\\mkern <dimen>\ngives horizontal space",
		"examples": [
			"ab",
			"a\\mkern18mu b",
			"a\\mkern18pt b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mod",
		"description": "modulus operator; modulo;\nthe leading space depends on the style: \u00a0 displaystyle has 18 mu,\nothers 12 mu;\n2 thinspaces of following space;\nfor things like equations modulo a number\n\\mod #1",
		"examples": [
			"3\\equiv 5 \\mod 2"
		],
		"see_also": [
			"\\pmod",
			"\\bmod"
		],
		"snippet": ""
	},
	{
		"name": "\\models",
		"description": "&#x22A8; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\moveleft",
		"description": "shifts boxes to the left or right\n\n\\moveleft <dimen> <box>\n\\moveright <dimen> <box>\n\nIn actual $\\rm\\TeX$, these require an \u00a0\\hbox\u00a0 (or some\nbox) as an argument, and can only appear in vertical mode;\nMathJax is less picky: you don't need an actual box, and MathJax\ndoesn't have a vertical mode;\nthese are not really designed as user-level macros, but instead allow existing macros to work;\nthe box takes up its original space (unlike something like\n\u00a0\\llap\u00a0 or \u00a0\\rlap\u00a0),\nbut its contents are shifted (without affecting its\nbounding box)",
		"examples": [
			"\\rm tight",
			"\\rm t\\moveleft3pt ight",
			"\\rm t\\moveleft3pt i\\moveleft3pt g\\moveleft3pt h\\moveleft3pt t",
			"\\rm t\\moveleft3pt i\\moveleft6pt g\\moveleft9pt h\\moveleft12pt t",
			"\\square\\square\\moveleft 2em {\\diamond\\diamond}",
			"\\square\\square\\moveright 2em {\\diamond\\diamond}"
		],
		"see_also": [
			"\\raise",
			"\\lower"
		],
		"snippet": ""
	},
	{
		"name": "\\mp",
		"description": "minus plus\n\n&#x2213; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [
			"\\pm"
		],
		"snippet": ""
	},
	{
		"name": "\\mskip",
		"description": "\\mskip <dimen>\ngives horizontal space",
		"examples": [
			"ab",
			"a\\mskip18mu b",
			"a\\mskip18pt b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mspace",
		"description": "\\mspace <dimen>\ngives horizontal space",
		"examples": [
			"ab",
			"a\\mspace18mu b",
			"a\\mspace18pt b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\mu",
		"description": "lowercase Greek letter mu\n\n&#x03BC; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\multimap",
		"description": "&#x22B8; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\nabla",
		"description": "&#x2207; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\natural",
		"description": "",
		"examples": "",
		"see_also": [
			"\\flat",
			"\\sharp",
			"ORD"
		],
		"snippet": ""
	},
	{
		"name": "\\ncong",
		"description": "not congruent\n\n&#x2246; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\cong"
		],
		"snippet": ""
	},
	{
		"name": "\\ne",
		"description": "not equal\n\n&#x2260; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"equals",
			"\\neq"
		],
		"snippet": ""
	},
	{
		"name": "\\nearrow",
		"description": "northeast arrow; non-stretchy\n\n&#x2197; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\nwarrow",
			"\\searrow",
			"\\swarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\neg",
		"description": "negate; negation\n\n&#x00AC; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [
			"\\lnot"
		],
		"snippet": ""
	},
	{
		"name": "\\negthinspace",
		"description": "negative thin space\nnegative medium space\nnegative thick space",
		"examples": [
			"ab",
			"a\\negthinspace b",
			"a\\negmedspace b",
			"a\\negthickspace b"
		],
		"see_also": [
			"\\thinspace"
		],
		"snippet": ""
	},
	{
		"name": "\\neq",
		"description": "",
		"examples": "",
		"see_also": [
			"equals",
			"\\ne",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\newcommand",
		"description": "for defining your own commands (control sequences, macros, definitions);\n\\newcommand\u00a0 must appear (within math delimiters) before it is used;\nif desired, you can use the \u00a0TeX.Macros\u00a0\nproperty of the configuration to define\nmacros in the head\n\n\\newcommand\\myCommandName\n[ <optional # of arguments, from 1 to 9> ]\n{ <replacement text> }\n\nThe bracketed # of arguments is omitted when there are no arguments.\n\nExample (no arguments):\n\n\\newcommand\\myHearts\n{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}\n\n\\myHearts\\myHearts\n\nyields:\n$\n\\newcommand\\myHearts\n{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}\n\n\\myHearts\\myHearts\n$\n\nA definition may take one or more arguments:\n\nExample (two arguments):\n\n\\newcommand\\myHearts[2]\n{\\color{#1}{\\heartsuit}\\kern-2.5pt\\color{#2}{\\heartsuit}}\n\n\\myHearts{red}{blue}\n\nyields:\n$\n\\newcommand\\myHearts[2]\n{\\color{#1}{\\heartsuit}\\kern-2.5pt\\color{#2}{\\heartsuit}}\n\n\\myHearts{red}{blue}\n$",
		"examples": "",
		"see_also": [
			"\\def",
			"\\newenvironment"
		],
		"snippet": ""
	},
	{
		"name": "\\newenvironment",
		"description": "for defining your own environments;\n\\newenvironment\u00a0 must appear (within math delimiters) before it is used\n\n\\newenvironment{myEnvironmentName}\n[ <optional # of arguments, from 1 to 9> ]\n{ <replacement text for each occurrence of \\begin{myEnvironmentName}> }\n{ <replacement text for each occurrence of \\end{myEnvironmentName}> }\n\nThe bracketed # of arguments is omitted when there are no arguments.\nThere must not be a command having the same name as the environment:\nfor example, to use \u00a0 \\begin{myHeart}...\\end{myHeart} \u00a0 there may not be a command \\myHeart.\n\nExample (no arguments):\n\n\\newenvironment{myHeartEnv}\n{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}\n{\\text{ forever}}\n\n\\begin{myHeartEnv}\n\\end{myHeartEnv}\n\nyields:\n$\n\\newenvironment{myHeartEnv}\n{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}\n{\\text{ forever}}\n\n\\begin{myHeartEnv}\n\\end{myHeartEnv}\n$\n\nAn environment may take one or more arguments:\n\nExample (two arguments):\n\n\\newenvironment{myHeartEnv}[2]\n{\\color{#1}{\\heartsuit}\\kern-2.5pt\\color{#2}{\\heartsuit}}\n{\\text{ forever}}\n\n\\begin{myHeartEnv}{red}{blue}\n\\end{myHeartEnv}\n\nyields:\n$\n\\newenvironment{myHeartEnv}[2]\n{\\color{#1}{\\heartsuit}\\kern-2.5pt\\color{#2}{\\heartsuit}}\n{\\text{ forever}}\n\n\\begin{myHeartEnv}{red}{blue}\n\\end{myHeartEnv}\n$",
		"examples": "",
		"see_also": [
			"\\def",
			"\\newcommand"
		],
		"snippet": ""
	},
	{
		"name": "\\newline",
		"description": "line separator in alignment modes and environments\n\nin MathJax, these are essentially the same: \u00a0 \\cr,\n\u00a0 \\\\",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\nexists",
		"description": "",
		"examples": "",
		"see_also": [
			"\\exists",
			"ORD"
		],
		"snippet": ""
	},
	{
		"name": "\\ngeq",
		"description": "not greater than or equal to&#x2271; \u00a0 class REL\nnot greater than or equal to&#x2271; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\geq",
			"\\geqq"
		],
		"snippet": ""
	},
	{
		"name": "\\ngeqslant",
		"description": "slanted not greater than or equal to\n\n&#x2A88; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\geqslant"
		],
		"snippet": ""
	},
	{
		"name": "\\ngtr",
		"description": "not greater than\n\n&#x226F; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\gt"
		],
		"snippet": ""
	},
	{
		"name": "\\ni",
		"description": "backwards \u2018in\u2019; contains\n\n&#x220B; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\in"
		],
		"snippet": ""
	},
	{
		"name": "\\nleftarrow",
		"description": "&#x219A; \u00a0 class REL\n&#x21CD; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\leftarrow",
			"\\Leftarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\nleftrightarrow",
		"description": "&#x21AE; \u00a0 class REL\n&#x21CE; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\leftrightarrow",
			"\\Leftrightarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\nleq",
		"description": "not less than or equal to&#x2270; \u00a0 class REL\nnot less than or equal to&#x2270; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\leq",
			"\\leqq"
		],
		"snippet": ""
	},
	{
		"name": "\\nleqslant",
		"description": "slanted not less than or equal to\n\n&#x2A87; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\leqslant"
		],
		"snippet": ""
	},
	{
		"name": "\\nless",
		"description": "",
		"examples": "",
		"see_also": [
			"\\lt",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\nmid",
		"description": "",
		"examples": "",
		"see_also": [
			"\\mid",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\nobreakspace",
		"description": "",
		"examples": [
			"a\\nobreakspace b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\nolimits",
		"description": "used to change the default placement of limits;\nonly allowed on items of class \u00a0OP",
		"examples": [
			"\\sum_{k=1}^n a_k",
			"\\sum\\nolimits_{k=1}^n a_k"
		],
		"see_also": [
			"\\limits"
		],
		"snippet": ""
	},
	{
		"name": "\\normalsize",
		"description": "turns on normal size\n\nclass ORD\n\n{\\normalsize ... }",
		"examples": [
			"\\rm \\scriptsize script \\normalsize normal \\large large"
		],
		"see_also": [
			"\\scriptsize"
		],
		"snippet": ""
	},
	{
		"name": "\\not",
		"description": "used to negate relations\n\n&#x002F; \u00a0\nclass REL",
		"examples": [
			"\\not\\gt",
			"\\ngtr"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\notag",
		"description": "used in AMS math environments that do automatic equation numbering,\nto suppress the equation number;\nsince MathJax doesn't implement auto-numbering (as of version 1.1a), it is basically a no-op,\nalthough it will cancel an explicit \u00a0\\tag\u00a0;\nwhen auto-numbering is added, then this will work as expected;\n\\notag\u00a0 is included now for compatibility with existing TeX code (to\nprevent throwing an error, even though it has no effect)\n\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\notin",
		"description": "",
		"examples": "",
		"see_also": [
			"\\in",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\nparallel",
		"description": "not parallel\n\n&#x2226; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\parallel"
		],
		"snippet": ""
	},
	{
		"name": "\\nprec",
		"description": "",
		"examples": "",
		"see_also": [
			"\\prec",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\npreceq",
		"description": "",
		"examples": "",
		"see_also": [
			"\\preceq",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\nrightarrow",
		"description": "&#x219B; \u00a0 class REL\n&#x21CF; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\rightarrow",
			"\\Rightarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\nshortmid",
		"description": "",
		"examples": "",
		"see_also": [
			"\\mid",
			"\\shortmid",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\nshortparallel",
		"description": "",
		"examples": "",
		"see_also": [
			"\\parallel",
			"\\shortparallel",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\nsim",
		"description": "",
		"examples": "",
		"see_also": [
			"\\sim",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\nsubseteq",
		"description": "&#x2288; \u00a0 class REL\n&#x2288; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\subseteq",
			"\\subseteqq"
		],
		"snippet": ""
	},
	{
		"name": "\\nsucc",
		"description": "&#x2281; \u00a0 class REL\n&#x22E1; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\succ",
			"\\succeq"
		],
		"snippet": ""
	},
	{
		"name": "\\nsupseteq",
		"description": "&#x2289; \u00a0 class REL\n&#x2289; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\supseteq",
			"\\supseteqq"
		],
		"snippet": ""
	},
	{
		"name": "\\ntriangleleft",
		"description": "&#x22EA; \u00a0 class REL\n&#x22EC; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\triangleleft",
			"\\trianglelefteq"
		],
		"snippet": ""
	},
	{
		"name": "\\ntriangleright",
		"description": "&#x22EB; \u00a0  class REL\n&#x22ED; \u00a0  class REL",
		"examples": "",
		"see_also": [
			"\\triangleright",
			"\\trianglerighteq"
		],
		"snippet": ""
	},
	{
		"name": "\\nu",
		"description": "lowercase Greek letter nu\n\n&#x03BD; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\nVDash",
		"description": "&#x22AF; \u00a0 class REL\n&#x22AE; \u00a0 class REL\n&#x22AD; \u00a0 class REL\n&#x22AC; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\Vdash",
			"\\vDash",
			"\\vdash"
		],
		"snippet": ""
	},
	{
		"name": "\\nwarrow",
		"description": "northwest arrow; non-stretchy\n\n&#x2196; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\nearrow",
			"\\searrow",
			"\\swarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\odot",
		"description": "&#x2299; \u00a0 class BIN\n&#x2296; \u00a0 class BIN\n&#x2295; \u00a0 class BIN\n&#x2298; \u00a0 class BIN\n&#x2297; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\oint",
		"description": "changes size;\ncan change limit placement using \\limits;\nsee the Big Operators Table for examples\n\n&#x222E; \u00a0\nclass OP",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\oldstyle",
		"description": "this is intended for oldstyle numbers;\nit is a switch that turns on oldstyle mode;\nthe way it works in $\\rm\\TeX$ is to select the caligraphic font\n(which is where the oldstyle\nnumbers are stored),\nso it has the side effect of selecting\ncaligraphic upper-case letters;\nMathJax does the same for compatibility\n\nclass ORD\n\n{\\oldstyle ... }",
		"examples": [
			"\\oldstyle 0123456789",
			"\\oldstyle ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"\\oldstyle abcdefghijklmnopqrstuvwxyz",
			"abcdefghijklmnopqrstuvwxyz",
			"{\\oldstyle AB}AB",
			"\\oldstyle AB \\rm AB",
			"\\oldstyle{AB}CD"
		],
		"see_also": [
			"\\cal",
			"\\mathcal"
		],
		"snippet": ""
	},
	{
		"name": "\\omega",
		"description": "lowercase Greek letter omega&#x03C9; \u00a0 class ORD\nuppercase Greek letter omega&#x03A9; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\varOmega"
		],
		"snippet": ""
	},
	{
		"name": "\\omicron",
		"description": "lowercase Greek letter omicron\n\n&#x03BF; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\operatorname",
		"description": "This is similar to \u00a0\\DeclareMathOperator,\nbut rather than defining a\nmacro, it produces an instance of an operator like \u00a0\\lim\u00a0.\n\nFor example,\n\\operatorname{myOp}\n\nis equivalent to the use of \u00a0\\myOp\u00a0, after having defined\n\n\\DeclareMathOperator{\\myOp}{myOp}\n\nIf displaystyle limits are desired in both inline and display modes,\nthen use \u00a0operatorname*\u00a0  instead of \u00a0operatorname\n\nclass OP",
		"examples": [
			"\\operatorname{myFct}(x)",
			"\\operatorname*{myFct}_a^b(x)"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\over",
		"description": "general command for making fractions\n{ <subformula1> \\over <subformula2> }\nCreates a fraction:\nnumerator: \u00a0 subformula1\ndenominator: \u00a0 subformula2",
		"examples": [
			"a \\over b",
			"a+1 \\over b+2",
			"{a+1 \\over b+2}+c"
		],
		"see_also": [
			"\\above",
			"\\abovewithdelims",
			"\\atop",
			"\\atopwithdelims",
			"\\cfrac",
			"\\dfrac",
			"\\frac",
			"\\genfrac",
			"\\overwithdelims"
		],
		"snippet": ""
	},
	{
		"name": "\\overbrace",
		"description": "puts a (stretchy) over-brace over the argument;\ncan use \u2018^\u2019 to place an optional superscript over the overbrace;\ncan use \u2018_\u2019 to place an optional subscript below the argument\n\\overbrace #1",
		"examples": [
			"\\overbrace{x + \\cdots + x}^{n\\rm\\ times}_{\\text{(note here)}"
		],
		"see_also": [
			"\\underbrace"
		],
		"snippet": ""
	},
	{
		"name": "\\overleftarrow",
		"description": "&#x2190;stretchy over left arrow\n&#x2192;stretchy over right arrow\n&#x2194;stretchy over left right arrow\n\n\\overleftarrow #1\n\\overrightarrow #1\n\\overleftrightarrow #1",
		"examples": [
			"\\overleftarrow{\\text{the argument}}",
			"\\overrightarrow{AB}",
			"\\overrightarrow{AB\\strut}",
			"\\overleftrightarrow{\\hspace1in}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\overline",
		"description": "stretchy overline\n\n&#x203E;\n\n\\overline #1",
		"examples": [
			"\\overline{AB}",
			"\\overline a",
			"\\overline{\\text{a long argument}}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\overparen",
		"description": "puts a (stretchy) over-parenthesis (over-arc, frown) over the argument (new in MathJax 2.6)\n\\overparen #1",
		"examples": [
			"\n\\overparen a \\quad\n\\overparen ab \\quad \n\\overparen{ab} \\quad\n\\overparen{abc} \\quad\n\\overparen{abcdef} \\quad\n\\overparen{\\underparen{abcd}}\n"
		],
		"see_also": [
			"\\underparen",
			"\\smallfrown",
			"\\frown",
			"\\smallsmile",
			"\\smile"
		],
		"snippet": ""
	},
	{
		"name": "\\overset",
		"description": "\\overset #1 #2\noversets argument #1 (in scriptstyle) over argument #2",
		"examples": [
			"\\overset{\\rm top}{\\rm bottom}",
			"\\overset ab",
			"a\\,\\overset{?}{=}\\,b"
		],
		"see_also": [
			"\\atop",
			"\\underset"
		],
		"snippet": "\\overset{@1@}{@2@}"
	},
	{
		"name": "\\overwithdelims",
		"description": "general command for making fractions;\nuses default thickness for fraction bar for current size\nspecifies left and right enclosing delimiters\n\n{ <subformula1> \\overwithdelims <delim1> <delim2> <subformula2> }\n\nCreates a fraction:\nnumerator \u00a0 subformula1\ndenominator \u00a0 subformula2\ndelim1 \u00a0 is put before the fraction\ndelim2 \u00a0 is put after the fraction\nFor an empty delimiter, use \u2018.\u2019 in place of the delimiter.",
		"examples": [
			"a \\overwithdelims [ ] b",
			"a+1 \\overwithdelims . | b+2",
			"{a+1 \\overwithdelims \\{ \\} b+2}+c"
		],
		"see_also": [
			"\\above",
			"\\abovewithdelims",
			"\\atop",
			"\\atopwithdelims",
			"\\cfrac",
			"\\dfrac",
			"\\frac",
			"\\genfrac",
			"\\over"
		],
		"snippet": ""
	},
	{
		"name": "\\owns",
		"description": "",
		"examples": "",
		"see_also": [
			"\\ni",
			"\\in",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\parallel",
		"description": "",
		"examples": "",
		"see_also": [
			"\\nparallel",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\partial",
		"description": "",
		"examples": [
			"\\frac{\\partial f}{\\partial x}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\perp",
		"description": "perpendicular to\n\n&#x22A5; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\phantom",
		"description": "phantom (both horizontal and vertical)\n\nclass ORD\n\nSometimes you want to pretend that something is there, for spacing reasons,\nbut you don't want it to appear\u2014you want it to be invisible\u2014you want it to be a phantom.\n\nThe box created by \u00a0 \\phantom \u00a0 has width, height and depth equal to its argument.\nIn other words, \\phantom \u00a0 creates horizontal and vertical space equal to that of its argument,\neven though the argument isn't visible.\n\\phantom #1",
		"examples": [
			"\n\\sqrt{\\frac ab}\n\\sqrt{\\phantom{\\frac ab}}\n",
			"\n\\frac{2x+3y-\\phantom{5}z}\n  {\\phantom{2}x+\\phantom{3}y+5z}\n",
			"\n\\Gamma^{\\phantom{i}j}_{i\\phantom{j}k}\n",
			"\n\\matrix{1&-1\\cr 2&\\phantom{-}3}\n"
		],
		"see_also": [
			"\\hphantom",
			"\\vphantom"
		],
		"snippet": ""
	},
	{
		"name": "\\phi",
		"description": "lowercase Greek letter phi\n&##x03D5; \u00a0 class ORD\n\nuppercase Greek letter phi\n&#x03A6; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\varphi",
			"\\varPhi"
		],
		"snippet": ""
	},
	{
		"name": "\\pi",
		"description": "lowercase Greek letter pi\n&#x03C0; \u00a0 class ORD\n\nuppercase Greek letter Pi\n&#x03A0; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\varpi",
			"\\varPi"
		],
		"snippet": ""
	},
	{
		"name": "\\pitchfork",
		"description": "&#x22D4; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\pm",
		"description": "plus or minus\n\n&x00B1; \u00a0\nclass BIN",
		"examples": "",
		"see_also": [
			"\\mp"
		],
		"snippet": ""
	},
	{
		"name": "\\pmatrix",
		"description": "matrix enclosed in parentheses\n\nclass OPEN\n\n\\pmatrix{ <math> & <math> ... \\cr <repeat as needed> }\nalignment occurs at the ampersands;\na double-backslash can be used in place of the \u00a0\\cr\u00a0;\nthe final \u00a0 \\\\ \u00a0 or \u00a0 \\cr \u00a0 is optional",
		"examples": [
			"\nA = \\pmatrix{\na_{11} & a_{12} & \\ldots & a_{1n} \\cr\na_{21} & a_{22} & \\ldots & a_{2n} \\cr\n\\vdots & \\vdots & \\ddots & \\vdots \\cr\na_{m1} & a_{m2} & \\ldots & a_{mn} \\cr\n}\n"
		],
		"see_also": [
			"\\matrix"
		],
		"snippet": "\\begin{pmatrix}\n\t@1@\n\\end{pmatrix}"
	},
	{
		"name": "\\pmb",
		"description": "poor man's bold;\nit works by duplicating its argument slightly offset,\ngiving a bold effect (at least in the horizontal direction);\ndoesn't work well for horizontal lines, like $\\,-\\,$ or $\\,+\\,$\n\nclass ORD\n\n\\pmb #1",
		"examples": [
			"a \\pmb a \\boldsymbol a",
			"\\pmb{a+b-c}\\ \\ a+b-c"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\pmod",
		"description": "parenthesized modulus operator; parenthesized modulo;\n18 mu of leading space before the opening parenthesis in display style;\n8 mu of leading space before the opening parenthesis in other styles;\n6 mu of space after the word \u00a0mod\n\\pmod #1",
		"examples": [
			"5\\equiv 8 \\pmod 3",
			"\\pmod{n+m}"
		],
		"see_also": [
			"\\mod",
			"\\bmod"
		],
		"snippet": ""
	},
	{
		"name": "\\pod",
		"description": "parenthesized argument with leading space;\n18 mu of leading space before the opening parenthesis in display style;\n8 mu of leading space before the opening parenthesis in other styles\n\\pod #1",
		"examples": [
			"x=y\\pod{\\text{inline mode}}",
			"x=y\\pod{\\text{display mode}}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Pr",
		"description": "does not change size;\ndefault limit placement can be changed using \u00a0\\limits\u00a0 and  \u00a0\\nolimits;\ndoes not change size;\nsee the Big Operators Table for more examples\n\nclass OP",
		"examples": [
			"\\Pr_{\\rm sub}",
			"\\Pr_{\\rm sub}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\prec",
		"description": "",
		"examples": "",
		"see_also": [
			"\\nprec",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\precapprox",
		"description": "&#x2AB7; \u00a0 class REL\n&#x2AB9; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\preccurlyeq",
		"description": "&#x227C; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\preceq",
		"description": "&#x2AAF; \u00a0 class REL\n&#x2AB5; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\npreceq"
		],
		"snippet": ""
	},
	{
		"name": "\\precsim",
		"description": "&#x227E; \u00a0 class REL\n&#x22E8; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\prime",
		"description": "prime character\n\n&#x2032; \u00a0\nclass ORD",
		"examples": [
			"f'",
			"f\\prime",
			"f^\\prime",
			"f^{\\prime\\prime}",
			"f''"
		],
		"see_also": [
			"\\backprime",
			"prime symbol"
		],
		"snippet": ""
	},
	{
		"name": "\\prod",
		"description": "changes size;\ncan change limit placement using \\limits and\n\\nolimits;\nsee the Big Operators Table for more examples\n\n&#x220F; \u00a0\nclass OP",
		"examples": [
			"\\prod_{j=1}^n",
			"\\prod_{j=1}^n"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\projlim",
		"description": "projective limit;\ndoes not change size;\ncan change limit placement using \\limits and\n\\nolimits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": "",
		"see_also": [
			"\\varprojlim"
		],
		"snippet": ""
	},
	{
		"name": "\\propto",
		"description": "",
		"examples": "",
		"see_also": [
			"\\varpropto",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\psi",
		"description": "lowercase Greek letter psi\n&#x03C9; \u00a0 class ORD\n\nuppercase Greek letter psi\n&#x03A9; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\varPsi"
		],
		"snippet": ""
	},
	{
		"name": "\\quad",
		"description": "\\quad \u00a0 is a 1em space\n\\qquad \u00a0 is a 2em space",
		"examples": [
			"|\\quad|\\quad|",
			"|\\qquad\\hphantom{|}|"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\raise",
		"description": "\\raise <dimen> #1\nraises the argument by the amount specified in <dimen>;\nin actual $\\rm\\TeX$, the argument to \u00a0\\raise\u00a0 (and \u00a0\\lower\u00a0) must be an\n\u00a0\\hbox\u00a0,\nbut in MathJax it can be any expression (using an \\hbox is allowed, but not required)",
		"examples": [
			"h\\raise 2pt {ighe} r"
		],
		"see_also": [
			"\\lower"
		],
		"snippet": ""
	},
	{
		"name": "\\rangle",
		"description": "right angle bracket;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\n&#x27E9; \u00a0 class CLOSE",
		"examples": [
			"\n\\left\\langle\n\\matrix{a & b\\cr c & d}\n\\right\\rangle\n"
		],
		"see_also": [
			"\\langle"
		],
		"snippet": ""
	},
	{
		"name": "\\rbrace",
		"description": "right brace;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\nclass CLOSE",
		"examples": [
			"\n\\left\\lbrace\n\\matrix{a & b\\cr c & d}\n\\right\\rbrace\n"
		],
		"see_also": [
			"\\lbrace"
		],
		"snippet": ""
	},
	{
		"name": "\\rbrack",
		"description": "right bracket;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\nclass CLOSE",
		"examples": [
			"\\lbrack \\frac ab, c \\rbrack",
			"\\left\\lbrack \\frac ab, c \\right\\rbrack"
		],
		"see_also": [
			"\\lbrack",
			"[\u00a0]"
		],
		"snippet": ""
	},
	{
		"name": "\\rceil",
		"description": "right ceiling;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\n&#x2309; \u00a0 class CLOSE",
		"examples": [
			"\n\\left\\lceil\n\\matrix{a & b\\cr c & d}\n\\right\\rceil\n"
		],
		"see_also": [
			"\\lceil",
			"\\lfloor",
			"\\rfloor"
		],
		"snippet": ""
	},
	{
		"name": "\\Re",
		"description": "&#x211C; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\renewcommand",
		"description": "equivalent to \\newcommand;\nfor clarity of code, you may choose to use \u00a0 \\renewcommand \u00a0\nwhen re-defining a macro;\nthis is different from actual $\\,\\rm\\TeX\\,$,\nwhere \u00a0\\renewcommand\u00a0 only allows redefining of an existing command",
		"examples": "",
		"see_also": [
			"\\def",
			"\\newcommand",
			"\\newenvironment"
		],
		"snippet": ""
	},
	{
		"name": "\\require",
		"description": "This is a MathJax-specific macro that can be used to load MathJax $\\rm\\TeX$ extensions (like the AMSmath extension)\nfrom within math mode, rather than having to include it in the configuration.\nFor example,\n\n$\\require{AMSsymbols}$\n\nwould cause MathJax to load the\n\u00a0extensions/TeX/AMSsymbols.js\u00a0 file at that point.\n\nSince many people use MathJax in blogs and wikis that may not have all the extensions loaded,\nthis makes it possible to load a lesser-used extension on a particular page,\nwithout having to include it in every page.",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\restriction",
		"description": "&#x21BE; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\rfloor",
		"description": "right floor;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n&#x230B; \u00a0 class CLOSE",
		"examples": "",
		"see_also": [
			"\\lfloor",
			"\\lceil",
			"\\rceil"
		],
		"snippet": ""
	},
	{
		"name": "\\rgroup",
		"description": "right group;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right\n\n&#x27EE; \u00a0 class CLOSE",
		"examples": [
			"\n\\left\\lgroup\n\\matrix{a & b\\cr c & d}\n\\right\\rgroup\n"
		],
		"see_also": [
			"\\lgroup"
		],
		"snippet": ""
	},
	{
		"name": "\\rhd",
		"description": "right-hand diamond\n\n&#x22B3; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\lhd"
		],
		"snippet": ""
	},
	{
		"name": "\\rho",
		"description": "lowercase Greek letter rho\n\n&#x0000; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\varrho"
		],
		"snippet": ""
	},
	{
		"name": "\\right",
		"description": "used for stretchy delimiters;\nsee the Variable-Sized Delimiters Table for details\n\nCan be followed by:\n\ndelimiter:\nsample code:\nyields:\n\n( \u00a0 )\n\\left( \\frac12 \\right)\n$\\left( \\frac12 \\right)$\n\n\\updownarrow\\Updownarrow\n\\left\\updownarrow \\phantom{\\frac12} \\right\\Updownarrow\n$\\left\\updownarrow \\phantom{\\frac12} \\right\\Updownarrow$",
		"examples": [
			"( \u00a0 )",
			"\\left( \\frac12 \\right)",
			"\\updownarrow\\Updownarrow",
			"\\left\\updownarrow \\phantom{\\frac12} \\right\\Updownarrow"
		],
		"see_also": [
			"\\left"
		],
		"snippet": ""
	},
	{
		"name": "\\rightarrow",
		"description": "non-stretchy&#x2192; \u00a0 class REL\nnon-stretchy&#x21D2; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\nrightarrow",
			"\\nRightarrow",
			"\\to"
		],
		"snippet": ""
	},
	{
		"name": "\\rightarrowtail",
		"description": "right arrow tail; non-stretchy\n\n&#x21A3; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\leftarrowtail"
		],
		"snippet": ""
	},
	{
		"name": "\\rightharpoondown",
		"description": "non-stretchy&#x21C1; \u00a0 class REL\nnon-stretchy&#x21C0; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\leftharpoondown",
			"\\rightharpoondown"
		],
		"snippet": ""
	},
	{
		"name": "\\rightleftarrows",
		"description": "right left arrows; non-stretchy\n\n&#x21C4; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\rightleftharpoons",
		"description": "right left harpoons; non-stretchy\n\n&#x21CC; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\rightrightarrows",
		"description": "right right arrows; non-stretchy\n\n&#x21C9; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\rightsquigarrow",
		"description": "right squiggle arrow; non-stretchy\n\n&#x21DD; \u00a0class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\rightthreetimes",
		"description": "right three times\n\n&#x22CC; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\risingdotseq",
		"description": "rising dot sequence\n\n&#x2253; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\fallingdotseq"
		],
		"snippet": ""
	},
	{
		"name": "\\rlap",
		"description": "right overlap\n\nclass ORD\n\n\\rlap #1\n\ncreates a box of width zero;\nthe argument is then placed just to the right of this zero-width box\n(and hence will overlap whatever lies to the right)",
		"examples": [
			"a\\mathrel{\\rlap{\\;/}{=}}b"
		],
		"see_also": [
			"\\llap"
		],
		"snippet": ""
	},
	{
		"name": "\\rm",
		"description": "turns on roman; \u00a0affects uppercase and lowercase letters, and digits;\nalso affects uppercase Greek\n\nclass ORD\n\n{\\rm ... }",
		"examples": [
			"\\rm AaBb\\alpha\\beta123",
			"{\\rm A B} A B",
			"\\Delta\\Gamma\\Lambda{\\rm\\Delta\\Gamma\\Lambda}",
			"\\rm AB \\bf CD",
			"\\rm{AB}CD"
		],
		"see_also": [
			"\\text",
			"\\hbox",
			"\\mathrm"
		],
		"snippet": ""
	},
	{
		"name": "\\rmoustache",
		"description": "right moustache;\nnon-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right \u00a0 (see below)\n\n&#x23B1; \u00a0 class CLOSE",
		"examples": [
			"\n\\left\\lmoustache\n\\phantom{\\matrix{a & b\\cr c & d}}\n\\right\\rmoustache\n"
		],
		"see_also": [
			"\\lmoustache"
		],
		"snippet": ""
	},
	{
		"name": "\\root ... \\of",
		"description": "\\root <index> \\of #1",
		"examples": [
			"\\root 3 \\of x",
			"\\root 13 \\of {\\frac 12}",
			"\\root n+1 \\of x + 2"
		],
		"see_also": [
			"\\sqrt",
			"\\leftroot",
			"\\uproot"
		],
		"snippet": ""
	},
	{
		"name": "\\Rrightarrow",
		"description": "non-stretchy\n\n&#x21DB; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Rsh",
		"description": "right shift; non-stretchy\n\n&#x21B1; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\Lsh"
		],
		"snippet": ""
	},
	{
		"name": "\\rtimes",
		"description": "",
		"examples": "",
		"see_also": [
			"\\ltimes",
			"BIN"
		],
		"snippet": ""
	},
	{
		"name": "\\Rule",
		"description": "a MathJax-specific macro giving a rule with\na specified width, height, and depth\n\n\\Rule <dimenWidth> <dimenHeight> <dimenDepth>\n\nwhere each argument is a\ndimension",
		"examples": [
			"x\\Rule{3px}{1ex}{2ex}x",
			"x\\Rule{3px}{2ex}{1ex}x"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\rvert",
		"description": "&#x2223; \u00a0 class CLOSE\n\n&#x2225; \u00a0 class CLOSE\n\nboth non-stretchy when used alone;\nstretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right",
		"examples": [
			"\\left\\lvert\\frac{\\frac ab}{\\frac cd}\\right\\rvert"
		],
		"see_also": [
			"\\lvert",
			"\\lVert",
			"|",
			"\\|"
		],
		"snippet": ""
	},
	{
		"name": "\\S",
		"description": "section symbol\n\n&#xA700; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\scr",
		"description": "turns on script typestyle for uppercase letters;\nlowercase letters are in a roman typestyle\n\nclass ORD\n\n{ \\scr ... }",
		"examples": [
			"\\scr ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"\\scr 0123456789abcdefghijklmnopqrstuvwxyz",
			"0123456789abcdefghijklmnopqrstuvwxyz",
			"{\\scr AB}AB",
			"\\scr AB \\rm AB",
			"\\scr{AB}CD"
		],
		"see_also": [
			"\\mathscr"
		],
		"snippet": ""
	},
	{
		"name": "\\scriptscriptstyle",
		"description": "used to over-ride automatic style rules and force scriptscript style;\nstays in force until the end of math mode or the braced group, or until another style is selected\n\nclass ORD\n\n{ \\scriptscriptstyle ... }",
		"examples": "",
		"see_also": [
			"\\displaystyle",
			"\\scriptstyle",
			"\\textstyle"
		],
		"snippet": ""
	},
	{
		"name": "\\scriptsize",
		"description": "turns on script size\n\nclass ORD\n\n{ \\scriptsize ... }",
		"examples": [
			"\\rm  \\scriptsize script \\normalsize normal \\large large"
		],
		"see_also": [
			"\\normalsize"
		],
		"snippet": ""
	},
	{
		"name": "\\scriptstyle",
		"description": "used to over-ride automatic style rules and force script style;\nstays in force until the end of math mode or the braced group, or until another style is selected\n\nclass ORD\n\n{ \\scriptstyle ... }",
		"examples": "",
		"see_also": [
			"\\displaystyle",
			"\\scriptscriptstyle",
			"\\textstyle"
		],
		"snippet": ""
	},
	{
		"name": "\\searrow",
		"description": "southeast arrow; non-stretchy\n\n&#x2198; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [
			"\\nearrow",
			"\\nwarrow",
			"\\swarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\sec",
		"description": "secant;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples\n\nclass OP",
		"examples": [
			"\\sec x",
			"\\sec(2x-1)"
		],
		"see_also": [
			"\\csc"
		],
		"snippet": ""
	},
	{
		"name": "\\setminus",
		"description": "set minus\n\n&#x2216; \u00a0\nclass BIN",
		"examples": [
			"A\\setminus B",
			"A\\backslash B"
		],
		"see_also": [
			"\\backslash"
		],
		"snippet": ""
	},
	{
		"name": "\\sf",
		"description": "turns on sans serif mode for uppercase and lowercase letters and digits,\nand for uppercase Greek\n\nclass ORD\n\n{ \\sf ... }",
		"examples": [
			"\\sf ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"\\sf 0123456789",
			"\\sf abcdefghijklmnopqrstuvwxyz",
			"ABCDE 01234 abcde",
			"{\\sf AB\\Delta\\Gamma\\Lambda}\\ AB\\Delta\\Gamma\\Lambda",
			"\\sf AB \\rm AB",
			"\\sf{AB}CD"
		],
		"see_also": [
			"\\mathsf"
		],
		"snippet": ""
	},
	{
		"name": "\\sharp",
		"description": "musical sharp symbol\n\n&#x266F; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [
			"\\flat",
			"\\natural"
		],
		"snippet": ""
	},
	{
		"name": "\\shortmid",
		"description": "",
		"examples": "",
		"see_also": [
			"\\nshortmid",
			"\\mid",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\shortparallel",
		"description": "",
		"examples": "",
		"see_also": [
			"\\nshortparallel",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\shoveleft",
		"description": "forces flush left or flush right typesetting in a \u00a0 \\multline \u00a0 or \u00a0 \\multline* \u00a0 environment (see examples)",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\sideset",
		"description": "used for putting symbols at the four \u2018corners\u2019 of a large operator\n(like $\\displaystyle\\sum$ or $\\displaystyle\\prod$ )\n\n\\sideset{_#1^#2}{_#3^#4} <large operator>\n\nwhere:\n\n#1 = lower left\n#2 = upper left\n#3 = lower right\n#4 = upper right",
		"examples": [
			"\\sideset{_1^2}{_3^4}\\sum"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\sigma",
		"description": "lowercase Greek letter sigma\n&#x03C3; \u00a0 class ORD\n\nuppercase Greek letter sigma\n&#x03A3; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\sum",
			"\\varsigma",
			"\\varSigma"
		],
		"snippet": ""
	},
	{
		"name": "\\sim",
		"description": "&#x223C; \u00a0 class REL\n&#x2243; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\nsim"
		],
		"snippet": ""
	},
	{
		"name": "\\sin",
		"description": "sine;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples\n\nclass OP",
		"examples": [
			"\\sin x",
			"\\sin(2x-1)"
		],
		"see_also": [
			"\\cos"
		],
		"snippet": ""
	},
	{
		"name": "\\sinh",
		"description": "hyperbolic sine;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples\n\nclass OP",
		"examples": [
			"\\sinh x",
			"\\sinh(2x-1)"
		],
		"see_also": [
			"\\cosh"
		],
		"snippet": ""
	},
	{
		"name": "\\skew",
		"description": "used to finely adjust the positioning on accents;\nparticularly useful for adjusting superaccents (accents on accents);\nusually requires trial-and-error adjustment for proper positioning\n\\skew #1 <accent>\nwhere #1 is a positive integer (the skew amount)",
		"examples": [
			"\\hat A",
			"\\skew7\\hat A",
			"\\tilde M",
			"\\skew{8}\\tilde M",
			"\\hat{\\hat A}",
			"\\skew4\\hat{\\hat A}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\small",
		"description": "turns on small size; affects all math\n\nclass ORD\n\n{\\small ... }",
		"examples": [
			"ab{\\small cd} cd",
			"ab\\small{cd} cd"
		],
		"see_also": [
			"\\tiny",
			"\\Tiny",
			"\\normalsize",
			"\\large",
			"\\Large",
			"\\LARGE",
			"\\huge",
			"\\Huge"
		],
		"snippet": ""
	},
	{
		"name": "\\smallfrown",
		"description": "small frown\n\n&#x2322; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\frown",
			"\\smile",
			"\\smallsmile"
		],
		"snippet": ""
	},
	{
		"name": "\\smallint",
		"description": "small integral\n\n&#x222B; \u00a0 class OP",
		"examples": "",
		"see_also": [
			"\\int"
		],
		"snippet": ""
	},
	{
		"name": "\\smallsetminus",
		"description": "small set minus\n\n&#x2216; \u00a0 class BIN",
		"examples": "",
		"see_also": [
			"\\setminus"
		],
		"snippet": ""
	},
	{
		"name": "\\smallsmile",
		"description": "small smile\n\n&#x2323; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\smile",
			"\\frown",
			"\\smallfrown"
		],
		"snippet": ""
	},
	{
		"name": "\\smash",
		"description": "By using  \\smash, \\phantom,\n\\hphantom,\n\\vphantom,\n\\rlap,\n\\llap,\nyou can typeset any mathematics,\nyet give it the width and/or height and/or depth of any other mathematics.\n\\smash #1\nTypesets the argument in a box with the same width as the argument,\nbut with height and depth equal to zero.\nIn other words: the argument of \u00a0 \\smash \u00a0 is visible, and has its natural width,\nbut does not contribute any height or depth to the surrounding mathematics\n(hence leaving the surrounding mathematics to dictate height and depth).\n\nclass ORD\n\nHere are some scenarios:\n\nto vertically \u00a0 \\smash \u00a0 the box containing \u00a0 this \u00a0 and make it instead behave vertically like \u00a0 that \u00a0:\n\\smash{this}\\vphantom{that}",
		"examples": [
			"\n\\sqrt{\\frac ab}\n\\sqrt{\\smash{7}\\vphantom{\\frac ab}}\n",
			"\n\\sqrt{\\frac{\\frac ab}{\\frac cd}}\n\\sqrt{\\smash{\\frac ef}\\vphantom{\\frac{\\frac ab}{\\frac cd}}}\n"
		],
		"see_also": [
			"\\hphantom",
			"\\vphantom",
			"\\phantom",
			"\\llap",
			"\\rlap"
		],
		"snippet": ""
	},
	{
		"name": "\\smile",
		"description": "smile\n\n&#x2323; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\smallsmile",
			"\\frown",
			"\\smallfrown"
		],
		"snippet": ""
	},
	{
		"name": "\\space",
		"description": "",
		"examples": [
			"a\\space b"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Space",
		"description": "a MathJax-specific macro giving space with\na specified width, height, and depth\n\n\\Space <dimenWidth> <dimenHeight> <dimenDepth>\n\nwhere each argument is a\ndimension\n\nCompare:\n\na\\Rule{5px}{4ex}{2ex}^b_c d\nyields\n$a\\Rule{5px}{4ex}{2ex}^b_c d$\n\na\\Space{5px}{4ex}{2ex}^b_c d\nyields\n$a\\Space{5px}{4ex}{2ex}^b_c d$",
		"examples": [
			"a\\Rule{5px}{4ex}{2ex}^b_c d",
			"a\\Space{5px}{4ex}{2ex}^b_c d"
		],
		"see_also": [
			"\\Rule"
		],
		"snippet": ""
	},
	{
		"name": "\\spadesuit",
		"description": "",
		"examples": "",
		"see_also": [
			"\\clubsuit",
			"\\diamondsuit",
			"\\heartsuit",
			"ORD"
		],
		"snippet": ""
	},
	{
		"name": "\\sphericalangle",
		"description": "&#x2222; \u00a0\nclass ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\sqcap",
		"description": "square cap&#x2293; \u00a0 class BIN\nsquare cup&#x2294; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\sqrt",
		"description": "square root (and other roots)\n\nclass ORD\n\n\\sqrt #1\n\\sqrt[n]{op} \u00a0 is equivalent to \u00a0 \\root n \\of {op}",
		"examples": [
			"\\sqrt x",
			"\\sqrt xy",
			"\\sqrt{xy}",
			"\\sqrt[3]{x+1}"
		],
		"see_also": [
			"\\root"
		],
		"snippet": ""
	},
	{
		"name": "\\sqsubset",
		"description": "square subset&#x228F; \u00a0 class REL\nsquare superset&#x2290; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\sqsubseteq",
		"description": "&#x2291; \u00a0 class REL\n&#x2292; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\square",
		"description": "&#x25A1; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\stackrel",
		"description": "stack relations;\nyou can stack anything (not just relations) but it creates\nan item of class \u00a0REL\u00a0\n(and usually the bottom is a \u00a0REL\u00a0 to start with,\nbut doesn't have to be)\n\\stackrel #1 #2\nwhere #1 (in superscript style) is stacked on top of #2",
		"examples": [
			"\\stackrel{\\rm def}{=}",
			"\\stackrel{\\rm top}{\\rm bottom}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\star",
		"description": "&#x22C6; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\strut",
		"description": "an invisible box with no width, height 8.6pt and depth 3pt;\nnote that \u00a0 \\mathstrut \u00a0 changes with the current size, but\n\u00a0 \\strut \u00a0 does not",
		"examples": [
			"\n\\sqrt{(\\ )}\n\\sqrt{\\mathstrut\\rm mathstrut}\n\\sqrt{\\strut\\rm strut}\n",
			"\n\\Tiny\n\\sqrt{(\\ )}\n\\sqrt{\\mathstrut\\rm mathstrut}\n\\sqrt{\\strut\\rm strut}\n",
			"\n\\Large\n\\sqrt{(\\ )}\n\\sqrt{\\mathstrut\\rm mathstrut}\n\\sqrt{\\strut\\rm strut}\n"
		],
		"see_also": [
			"\\mathstrut"
		],
		"snippet": ""
	},
	{
		"name": "\\style ",
		"description": "[HTML] non-standard;\nused to apply CSS styling to mathematics\n\\style #1 #2\nwhere:\n\n#1\u00a0 is a (single) CSS style declaration\n#2\u00a0 is the mathematics to be styled",
		"examples": [
			"\\frac{\\style{color:red}{x+1}}{y+2}\n",
			"\\style{background-color:yellow}{\\frac{x+1}{y+2}}\n"
		],
		"see_also": [
			"\\class",
			"\\cssId"
		],
		"snippet": ""
	},
	{
		"name": "\\subset",
		"description": "&#x2282; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Subset",
		"description": "&#x22D0; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\subseteq",
		"description": "&#x2286; \u00a0 class REL\n&#x228A; \u00a0 class REL\n&#x2AC5; \u00a0 class REL\n&#x2ACB; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\nsubseteq",
			"\\nsubseteqq",
			"\\varsubsetneq",
			"\\varsubsetneqq"
		],
		"snippet": ""
	},
	{
		"name": "\\substack",
		"description": "use for multi-line subscripts or superscripts",
		"examples": [
			"\n\\sum_{\n\\substack{\n1\\lt i\\lt 3 \\\\\n1\\le j\\lt 5\n}}\na_{ij}\n",
			"\n^{\\substack{\\text{a very} \\\\\n\\text{contrived} \\\\\n\\text{example}\n}}\n{\\frac ab}_{\\substack{\n\\text{isn't} \\\\\n\\text{it?}\n}}\n"
		],
		"see_also": [
			"\\begin{subarray}"
		],
		"snippet": ""
	},
	{
		"name": "\\succ",
		"description": "",
		"examples": "",
		"see_also": [
			"\\nsucc",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\succapprox",
		"description": "&#x2AB8; \u00a0 class REL\n&#x2ABA; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\succcurlyeq",
		"description": "&#x227D; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\succeq",
		"description": "&#x2AB0; \u00a0 class REL\n&#x2AB6; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\nsucceq"
		],
		"snippet": ""
	},
	{
		"name": "\\succsim",
		"description": "&#x227F; \u00a0 class REL\n&#x22E9; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\sum",
		"description": "summation notation;\nchanges size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\n&#x2211; \u00a0 class OP",
		"examples": "",
		"see_also": [
			"\\Sigma"
		],
		"snippet": ""
	},
	{
		"name": "\\sup",
		"description": "supremum;\nleast upper bound;\ndoes not change size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": [
			"\\sup_{\\rm limit}",
			"\\sup_{\\rm limit}"
		],
		"see_also": [
			"\\inf"
		],
		"snippet": ""
	},
	{
		"name": "\\supset",
		"description": "&#x2283; \u00a0\nclass REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Supset",
		"description": "&#x22D1; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\supseteq",
		"description": "&#x2287; \u00a0 class REL\n&#x228B; \u00a0 class REL\n&#x2AC6; \u00a0 class REL\n&#x2ACC; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\nsupseteq",
			"\\nsupseteqq",
			"\\varsupsetneq",
			"\\varsupsetneqq"
		],
		"snippet": ""
	},
	{
		"name": "\\surd",
		"description": "&#x221A; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\swarrow",
		"description": "southwest arrow; non-stretchy\n\n&#x2199; \u00a0\nclass REL",
		"examples": "",
		"see_also": [
			"\\nearrow",
			"\\nwarrow",
			"\\searrow"
		],
		"snippet": ""
	},
	{
		"name": "\\tag",
		"description": "used primarily in AMS math environments to\nget tags (equation numbers, labels);\ncan, however, be used on any equation;\nthe argument of \u00a0\\tag\u00a0 is typeset in text mode, but\nmath mode can be used within the text:\nfor example, \u00a0\\tag{\\$\\bullet\\$}\u00a0\nYou can use dollar signs in text-mode regardless of the settings of the \u00a0inlineMath\u00a0 delimiters in the\ntex2jax preprocessor.\n\\tag #1",
		"examples": [
			"\n\\eqalign{\n3x - 4y &= 5\\cr\nx + 7 &= -2y\n} \n\\tag{3.1c}\n"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\tan",
		"description": "tangent;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples\n\nclass OP",
		"examples": [
			"\\tan x",
			"\\tan(2x-1)"
		],
		"see_also": [
			"\\cot"
		],
		"snippet": ""
	},
	{
		"name": "\\tanh",
		"description": "hyperbolic tangent;\ndoes not change size;\ndefault limit placement is the same in both inline and display modes;\ncan change limit placement using \\limits;\nsee the Big Operators Table for more examples\n\nclass OP",
		"examples": [
			"\\tanh x",
			"\\tanh(2x-1)"
		],
		"see_also": [
			"\\cosh",
			"\\sinh"
		],
		"snippet": ""
	},
	{
		"name": "\\tau",
		"description": "lowercase Greek letter tau\n\n&#x03C4; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\tbinom",
		"description": "notation commonly used for binomial coefficients; in textstyle\n\\tbinom #1 #2",
		"examples": [
			"\\tbinom n k",
			"\\tbinom n k",
			"\\binom n k",
			"\\tbinom{n-1}k-1",
			"\\tbinom{n-1}{k-1}"
		],
		"see_also": [
			"\\binom",
			"\\choose",
			"\\dbinom"
		],
		"snippet": ""
	},
	{
		"name": "\\TeX",
		"description": "the TeX logo\n\nclass ORD",
		"examples": [
			"\\TeX",
			"\\rm\\TeX"
		],
		"see_also": [
			"\\LaTeX"
		],
		"snippet": ""
	},
	{
		"name": "\\text",
		"description": "\\text: \u00a0 text\n\\textbf: \u00a0 boldface text\n\\textit: \u00a0 italic text\n\\textrm: \u00a0 roman text\n\\textsf: \u00a0 sans serif text (added in MathJax 2.4)\n\\texttt: \u00a0 typewriter text (added in MathJax 2.4)\n\nused to produce text-mode material (in a given font) within a mathematical expression;\nMathJax does not process any macros within the text (unlike $\\rm\\TeX$ itself);\nyou can get math mode within the text using \u00a0\\(...\\)\u00a0 delimiters\n\nclass ORD\n\n\\text #1\n\\textbf #1\n\\textit #1\n\\textrm #1\n\\textsf #1\n\\texttt #1",
		"examples": [
			"|x| = x \\text{ for all \\(x \\ge 0\\)}",
			"\\text{\\alpha in text mode }\\alpha",
			"\\textbf{\\alpha in textbf mode }\\alpha",
			"\\textit{\\alpha in textit mode }\\alpha",
			"\\textrm{\\alpha in textrm mode }\\alpha",
			"\\textsf{\\alpha in textsf mode }\\alpha",
			"\\texttt{\\alpha in texttt mode }\\alpha"
		],
		"see_also": [
			"\\bf",
			"\\mathbf",
			"\\it",
			"\\mathit",
			"\\rm",
			"\\mathrm",
			"\\sf",
			"\\mathsf",
			"\\tt",
			"\\mathtt"
		],
		"snippet": ""
	},
	{
		"name": "\\textstyle",
		"description": "used to over-ride automatic style rules and force text (inline) style;\nstays in force until the end of math mode or the braced group, or until another style is selected\n\nclass ORD\n\n{ \\textstyle ... }",
		"examples": "",
		"see_also": [
			"\\displaystyle",
			"\\scriptstyle",
			"\\scriptscriptstyle"
		],
		"snippet": ""
	},
	{
		"name": "\\tfrac",
		"description": "textstyle fraction\n\\tfrac #1 #2",
		"examples": [
			"\\tfrac ab \\frac ab",
			"\\tfrac ab \\frac ab"
		],
		"see_also": [
			"\\frac",
			"\\dfrac"
		],
		"snippet": ""
	},
	{
		"name": "\\therefore",
		"description": "&#x2234 \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\theta",
		"description": "lowercase Greek letter theta&#x03B8; \u00a0 class ORD\nuppercase Greek letter theta&#x0398; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\vartheta",
			"\\varTheta"
		],
		"snippet": ""
	},
	{
		"name": "\\thickapprox",
		"description": "",
		"examples": "",
		"see_also": [
			"\\approx"
		],
		"snippet": ""
	},
	{
		"name": "\\thicksim",
		"description": "",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\thinspace",
		"description": "thin space; normally $\\frac 16$ of a quad",
		"examples": "",
		"see_also": [
			"symbols for spaces",
			"\\negthinspace"
		],
		"snippet": ""
	},
	{
		"name": "\\tilde",
		"description": "non-stretchy tilde accent\n\n&#x02DC;\n\n\\tilde #1\nUsually, #1 is a single letter; \u00a0otherwise, accent is centered over argument.",
		"examples": [
			"\\tilde e",
			"\\tilde E",
			"\\tilde eu",
			"\\tilde{eu}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\times",
		"description": "&#x00D7; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\tiny",
		"description": "turns on tiny; a bit smaller than \\Tiny\n\nclass ORD\n\n{\\tiny ... }",
		"examples": [
			"\\tiny AaBb\\alpha\\beta123",
			"{\\tiny A B} A B",
			"\\tiny AB \\Tiny CD",
			"\\tiny{AB}CD"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Tiny",
		"description": "turns on Tiny; a bit bigger than \\tiny\n\nclass ORD\n\n{\\Tiny ... }",
		"examples": [
			"\\Tiny AaBb\\alpha\\beta123",
			"{\\Tiny A B} A B",
			"\\Tiny AB \\tiny CD",
			"\\Tiny{AB}CD"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\to",
		"description": "non-stretchy\n\n&#x2192; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\rightarrow"
		],
		"snippet": ""
	},
	{
		"name": "tool tips",
		"description": "Tool tips are not built into MathJax,\nbut you can click here to benefit from\na posting by Davide P. Cervone (April 2011) at the\nMathJax Users Group.",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\top",
		"description": "&#x22A4; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\triangle",
		"description": "&#x25B3; \u00a0 class ORD\n&#x25BD; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\ntriangleleft",
			"\\ntriangleright",
			"\\vartriangle",
			"\\vartriangleleft",
			"\\vartriangleright"
		],
		"snippet": ""
	},
	{
		"name": "\\triangleleft",
		"description": "&#x25C3; \u00a0 class BIN\n&#x25B9; \u00a0 class BIN",
		"examples": "",
		"see_also": [
			"\\ntriangleleft",
			"\\ntriangleright",
			"\\vartriangle",
			"\\vartriangleleft",
			"\\vartriangleright"
		],
		"snippet": ""
	},
	{
		"name": "\\trianglelefteq",
		"description": "&#x22B4; \u00a0 class REL\n&#x22B5 \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\ntrianglelefteq",
			"\\ntrianglerighteq"
		],
		"snippet": ""
	},
	{
		"name": "\\triangleq",
		"description": "&#x225C; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\tt",
		"description": "turns on typewriter type\n\nclass ORD\n\n{\\tt ... }",
		"examples": [
			"\\tt AaBb\\alpha\\beta123",
			"{\\tt A B} A B",
			"\\tt AB \\rm CD",
			"\\tt{AB}CD"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\twoheadleftarrow",
		"description": "non-stretchy &#x219E; \u00a0 class REL\nnon-stretchy&#x21A0; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\ulcorner",
		"description": "upper left corner\n&#x250C; \u00a0 class REL\n\nupper right corner\n&#x2510; \u00a0 class REL\n\nThese are technically delimiters, but MathJax\ndoesn't stretch them.\nThey are valid after \u00a0\\left,\n\u00a0\\right, and the various \u00a0\\big\u00a0 commands.",
		"examples": "",
		"see_also": [
			"\\llcorner",
			"\\lrcorner"
		],
		"snippet": ""
	},
	{
		"name": "\\underbrace",
		"description": "puts a (stretchy) under-brace under the argument;\ncan use \u2018^\u2019 to place an optional superscript over the argument;\ncan use \u2018_\u2019 to place an optional subscript below the underbrace\n\\underbrace #1",
		"examples": [
			"\\underbrace{x + \\cdots + x}_{n\\rm\\ times}^{\\text{(note here)}"
		],
		"see_also": [
			"\\overbrace"
		],
		"snippet": ""
	},
	{
		"name": "\\underleftarrow",
		"description": "stretchy under left arrow\n&#x2190;\n\nstretchy under right arrow\n&#x2192;\n\nstretchy under left right arrow\n&#x2194;\n\n\\underleftarrow #1\n\\underrightarrow #1\n\\underleftrightarrow #1",
		"examples": [
			"\\underleftarrow{\\text{the argument}}",
			"\\underrightarrow{AB}",
			"\\underrightarrow{AB\\strut}",
			"\\underleftrightarrow{\\hspace1in}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\underline",
		"description": "stretchy underline\n\n&#x005F;\n\n\\underline #1",
		"examples": [
			"\\underline{AB}",
			"\\underline a",
			"\\underline{\\text{a long argument}}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\underparen",
		"description": "puts a (stretchy) under-parenthesis (under-arc, smile) under the argument (new in MathJax 2.6)\n\\underparen #1",
		"examples": [
			"\n\\underparen a \\quad\n\\underparen ab \\quad \n\\underparen{ab} \\quad\n\\underparen{abc} \\quad\n\\underparen{abcdef} \\quad\n\\underparen{\\overparen{abcd}}\n"
		],
		"see_also": [
			"\\overparen",
			"\\smallfrown",
			"\\frown",
			"\\smallsmile",
			"\\smile"
		],
		"snippet": ""
	},
	{
		"name": "\\underset",
		"description": "\\underset #1 #2\nundersets argument #1 (in scriptstyle) under argument #2;\nthe top item is properly aligned with the surrounding text (their baselines match)",
		"examples": [
			"\\underset{\\rm bottom}{\\rm top}",
			"\\underset ab"
		],
		"see_also": [
			"\\overset"
		],
		"snippet": "\\underset{@1@}{@2@}"
	},
	{
		"name": "\\unicode",
		"description": "implements a \u00a0\\unicode{}\u00a0 extension to $\\rm\\TeX$\nthat allows arbitrary unicode code points to be entered in mathematics;\ncan optionally specify height and depth of character (width is determined by browser);\ncan optionally specify the default font from which to take the character;\nonce a size and font are provided for a given unicode point, they need not be specified again in subsequent\n\u00a0\\unicode{}\u00a0 calls for that character\n\nclass ORD\n\n\\unicode[optHeight,optDepth][optFont]#1",
		"examples": [
			"\\unicode{x263a}",
			"&#x263a;",
			"\\unicode[.55,0.05]{x22D6}",
			"\\unicode[.55,0.05][Geramond]{x22D6}",
			"\\unicode[Geramond]{x22D6}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\unlhd",
		"description": "underlined left-hand (left-pointing) diamond\n&#x22B4; \u00a0 class REL\n\nunderlined right-hand (right-pointing) diamond\n&#x22B5; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\uparrow",
		"description": "non-stretchy\n&#x2191; \u00a0 class REL\n\nnon-stretchy\n&#x21D1; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\updownarrow",
		"description": "non-stretchy\n&#x2195; \u00a0 class REL\n\nnon-stretchy\n&#x21D5; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\upharpoonleft",
		"description": "non-stretchy\n&#x21BF; \u00a0 class REL\n\nnon-stretchy\n&#x21BE; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\uplus",
		"description": "&#x228E; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\uproot",
		"description": "used to fine-tune the placement of the index inside\n\u00a0 \\sqrt \u00a0 or \u00a0 \\root \u00a0 (see examples)\n\n\\sqrt[... \\uproot #1 ...]{...}\n\\root ... \\uproot #1 ... \\of {...}\n\nwhere the argument is a small integer:\na positive integer moves the index up;\na negative integer moves the index down\n\nIn actual TeX, \u00a0\\uproot\u00a0 is not allowed in\n\u00a0\\root\u00a0,\nso this is a difference between MathJax and $\\rm\\TeX$.",
		"examples": [
			"\\sqrt[3]{x}",
			"\\sqrt[3\\uproot2]{x}",
			"\\root 3 \\of x",
			"\\root 3\\uproot{-2} \\of x"
		],
		"see_also": [
			"\\leftroot",
			"\\root"
		],
		"snippet": ""
	},
	{
		"name": "\\upsilon",
		"description": "lowercase Greek letter upsilon\n&#x03C5; \u00a0 class ORD\n\nuppercase Greek letter upsilon\n&#x03A5; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\varupsilon",
			"\\varUpsilon"
		],
		"snippet": ""
	},
	{
		"name": "\\upuparrows",
		"description": "non-stretchy\n\n&#x21C8; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\varDelta",
		"description": "uppercase Greek letter delta; variant\n\n&#x0394; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Delta"
		],
		"snippet": ""
	},
	{
		"name": "\\varepsilon",
		"description": "lowercase Greek letter epsilon; variant\n\n&#x03B5; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\epsilon"
		],
		"snippet": ""
	},
	{
		"name": "\\varGamma",
		"description": "uppercase Greek letter gamma; variant\n\n&#x0393; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Gamma"
		],
		"snippet": ""
	},
	{
		"name": "\\varinjlim",
		"description": "injective limit; variant;\ndoes not change size;\ncan change limit placement using \\limits and  \\nolimits;\nsee the Big Operators Table for examples\n\nclass OP",
		"examples": "",
		"see_also": [
			"\\injlim"
		],
		"snippet": ""
	},
	{
		"name": "\\varkappa",
		"description": "lowercase Greek letter kappa; variant\n\n&#x03F0; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\kappa"
		],
		"snippet": ""
	},
	{
		"name": "\\varLambda",
		"description": "uppercase Greek letter lambda; variant\n\n&#x039B; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Lambda"
		],
		"snippet": ""
	},
	{
		"name": "\\varlimsup",
		"description": "limit superior; variant\nclass OP\n\nlimit inferior; variant\nclass OP\n\ndo not change size;\ncan change limit placement using \u00a0\\limits\u00a0 and\n\u00a0\\nolimits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [
			"\\limsup",
			"\\liminf"
		],
		"snippet": ""
	},
	{
		"name": "\\varnothing",
		"description": "",
		"examples": "",
		"see_also": [
			"\\emptyset",
			"ORD"
		],
		"snippet": ""
	},
	{
		"name": "\\varOmega",
		"description": "uppercase Greek letter omega; variant\n\n&#x03A9; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Omega"
		],
		"snippet": ""
	},
	{
		"name": "\\varphi",
		"description": "lowercase Greek letter phi; variant\n\n&#x03C6; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\phi"
		],
		"snippet": ""
	},
	{
		"name": "\\varPhi",
		"description": "uppercase Greek letter phi; variant\n\n&#x03A6; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Phi"
		],
		"snippet": ""
	},
	{
		"name": "\\varpi",
		"description": "lowercase Greek letter pi; variant\n\n&#x03D6; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\pi"
		],
		"snippet": ""
	},
	{
		"name": "\\varPi",
		"description": "uppercase Greek letter pi; variant\n\n&#x03A0; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Pi"
		],
		"snippet": ""
	},
	{
		"name": "\\varprojlim",
		"description": "projective limit; variant;\ndoes not change size;\ncan change limit placement using \\limits and\n\\nolimits;\nsee the Big Operators Table for examples",
		"examples": "",
		"see_also": [
			"\\projlim"
		],
		"snippet": ""
	},
	{
		"name": "\\varpropto",
		"description": "proportional to; variant\n\n&#x221D; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\propto"
		],
		"snippet": ""
	},
	{
		"name": "\\varPsi",
		"description": "uppercase Greek letter pi; variant\n\n&#x03A8; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Psi"
		],
		"snippet": ""
	},
	{
		"name": "\\varrho",
		"description": "lowercase Greek letter rho; variant\n\n&#x03F1; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\rho"
		],
		"snippet": ""
	},
	{
		"name": "\\varsigma",
		"description": "lowercase Greek letter sigma; variant\n\n&#x03C2; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\sigma"
		],
		"snippet": ""
	},
	{
		"name": "\\varSigma",
		"description": "uppercase Greek letter sigma; variant\n\n&#x03C2; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Sigma"
		],
		"snippet": ""
	},
	{
		"name": "\\varsubsetneq",
		"description": "&#x228A; \u00a0 class REL\n&#x2ACB; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\subsetneq",
			"\\subsetneqq"
		],
		"snippet": ""
	},
	{
		"name": "\\varsupsetneq",
		"description": "&#x228B; \u00a0 class REL\n&#x2ACC; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\supsetneq",
			"\\supsetneqq"
		],
		"snippet": ""
	},
	{
		"name": "\\vartheta",
		"description": "lowercase Greek letter theta; variant&#x03D1; \u00a0 class ORD\nuppercase Greek letter theta; variant&#x0398; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\theta",
			"\\Theta"
		],
		"snippet": ""
	},
	{
		"name": "\\vartriangle",
		"description": "&#x25B3; \u00a0 class REL\n&#x22B2; \u00a0 class REL\n&#x22B3; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\triangle",
			"\\triangleleft",
			"\\triangleright"
		],
		"snippet": ""
	},
	{
		"name": "\\varUpsilon",
		"description": "uppercase Greek letter upsilon; variant\n\n&#x03A5; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\upsilon"
		],
		"snippet": ""
	},
	{
		"name": "\\varXi",
		"description": "uppercase Greek letter xi; variant\n\n&#x039E; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\Xi"
		],
		"snippet": ""
	},
	{
		"name": "\\vcenter",
		"description": "\\vcenter #1\ncenters the argument on the \u2018math axis\u2019,\nwhich is at\nhalf the height of an \u2018x\u2019, or about the position of a minus sign;\none of the reasons for \u00a0\\vcenter\u00a0 is to get stretchy delimiters to match the\ncontents better",
		"examples": [
			"\\left(\\Rule{1ex}{2em}{0pt}\\right)",
			"\\left(\\vcenter{\\Rule{1ex}{2em}{0pt}}\\right)",
			"\\left(\\frac{a+b}{\\dfrac{c}{d}}\\right)",
			"\\left(\\vcenter{\\frac{a+b}{\\dfrac{c}{d}}}\\right)"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\vdash",
		"description": "",
		"examples": "",
		"see_also": [
			"\\nvdash",
			"REL"
		],
		"snippet": ""
	},
	{
		"name": "\\Vdash",
		"description": "&#x22A9; \u00a0 class REL\n&#x22A8; \u00a0 class REL",
		"examples": "",
		"see_also": [
			"\\nVdash",
			"\\nvDash"
		],
		"snippet": ""
	},
	{
		"name": "\\vdots",
		"description": "vertical dots\n\n&#x22EE; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\vec",
		"description": "non-stretchy vector symbol\n\\vec #1",
		"examples": [
			"\\vec v",
			"\\vec{AB}"
		],
		"see_also": [
			"\\overrightarrow"
		],
		"snippet": ""
	},
	{
		"name": "\\vee",
		"description": "",
		"examples": "",
		"see_also": [
			"\\lor",
			"BIN"
		],
		"snippet": ""
	},
	{
		"name": "\\veebar",
		"description": "&#x22BB; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\verb",
		"description": "verbatim mode;\nuseful for code snippets and for displaying special characters \u2018as is\u2019 (i.e., not interpreted by MathJax).\nOnly works in display mode.\nUsually, verbatim content is typeset in a sans serif font.\n\\verb $\\diamond$ <non-interpreted material> $\\diamond$\nwhere \u00a0 $\\diamond$ \u00a0 denotes a non-letter character that does not appear in the <non-interpreted material>.\n\nTo use  \u00a0\\verb \u00a0:\n\nFirst look through the material that is to be typeset \u2018as is\u2019 (verbatim).\nChoose a non-letter character that does not appear in this material.\n\nThis chosen non-letter character will mark the beginning and end of the verbatim material,\nas illustrated in the",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\vert",
		"description": "class ORD\n&#x2225; \u00a0 class ORD\n\nboth non-stretchy when used alone; stretchy when used with \u00a0 \\left \u00a0 or \u00a0 \\right",
		"examples": "",
		"see_also": [
			"|",
			"\\|",
			"\\lvert",
			"\\lVert",
			"\\rvert",
			"\\rVert"
		],
		"snippet": ""
	},
	{
		"name": "\\vphantom",
		"description": "vertical phantom\n\nSometimes you want to pretend that something is there, for spacing reasons,\nbut you don't want it to appear\u2014you want it to be invisible\u2014you want it to be a phantom.\n\nThe box created by \u00a0 \\vphantom \u00a0 has the height and depth of its argument,\nbut its width is zero (so it doesn't contribute to any horizontal spacing issues).\nIn other words, \\vphantom \u00a0 creates vertical space equal to that produced by its argument,\nbut doesn't create any horizontal space.\n\\vphantom #1",
		"examples": [
			"\\binom{\\frac ab}c  \\binom{\\vphantom{\\frac ab}?}c"
		],
		"see_also": [
			"\\phantom",
			"\\hphantom",
			"\\smash"
		],
		"snippet": ""
	},
	{
		"name": "\\Vvdash",
		"description": "&#x22AA; \u00a0 class REL",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\wedge",
		"description": "",
		"examples": "",
		"see_also": [
			"\\land",
			"BIN"
		],
		"snippet": ""
	},
	{
		"name": "\\widehat",
		"description": "stretchy hat accent\n\n&#x02C6;\n\n\\widehat #1",
		"examples": [
			"\\widehat a",
			"\\widehat A",
			"\\widehat AB",
			"\\widehat{AB}"
		],
		"see_also": [
			"\\hat"
		],
		"snippet": ""
	},
	{
		"name": "\\widetilde",
		"description": "stretchy tilde accent\n\n&#x02DC;\n\n\\widetilde #1",
		"examples": [
			"\\widetilde a",
			"\\widetilde A",
			"\\widetilde AB",
			"\\widetilde{AB}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\wp",
		"description": "\u2018wriggly\u2019 letter p\n\n&#x2118; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\wr",
		"description": "\u2018wriggle\u2019 symbol;\n\n&#x2240; \u00a0 class BIN",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\Xi",
		"description": "uppercase Greek letter xi\n\n&#x039E; \u00a0 class ORD",
		"examples": "",
		"see_also": [
			"\\varXi"
		],
		"snippet": ""
	},
	{
		"name": "\\xi",
		"description": "lowercase Greek letter xi\n\n&#x03BE; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\xleftarrow",
		"description": "stretchy arrows with mathematical overset and optional mathematical underset\n\nclass REL\n\n\\xleftarrow[optionalArgument] #1\n\\xrightarrow[optionalArgument] #1\n\nwhere the optional arguments (inside brackets, if desired) appear below the arrows (see examples).",
		"examples": [
			"\\xrightarrow a",
			"\\xrightarrow ab",
			"\\xrightarrow{ab}",
			"\\xleftarrow{\\text{see equation (1)}}",
			"\\xrightarrow[f]{\\text{see (1)}}"
		],
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\yen",
		"description": "&#x00A5; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "\\zeta",
		"description": "lowercase Greek letter zeta\n\n&#x03B6; \u00a0 class ORD",
		"examples": "",
		"see_also": [],
		"snippet": ""
	},
	{
		"name": "align",
		"description": "For vertical alignment of two or more lines at one or more places:\n\nampersand(s) \u2018&\u2019 are used to indicate desired alignments (see",
		"examples": "",
		"see_also": [
			"\\eqalign",
			"\\eqalignno",
			"\\leqalignno"
		],
		"snippet": "\\begin{align}\n\t@1@\n\\end{align}"
	},
	{
		"name": "align*",
		"description": "[May 2011] same as align",
		"examples": "",
		"see_also": [],
		"snippet": "\\begin{align*}\n\t@1@\n\\end{align*}"
	},
	{
		"name": "alignat",
		"description": "For vertical alignment of two or more lines at one or more places;\nproduces a more horizontally-compressed display than align:\n\nthe alignat environment is started with \u00a0 \\begin{alignat}{<num>}\u00a0,\nwhere \u00a0 num \u00a0 is a positive integer ($1,2,3,\\ldots$) that indicates the number of places\nwhere alignment is desired\n\nampersand(s) \u2018&\u2019 are used to indicate desired alignments (see",
		"examples": "",
		"see_also": [
			"\\eqalignat",
			"\\eqalignatno",
			"\\leqalignatno"
		],
		"snippet": "\\begin{alignat}\n\t@1@\n\\end{alignat}"
	},
	{
		"name": "alignat*",
		"description": "[May 2011] same as alignat",
		"examples": "",
		"see_also": [],
		"snippet": "\\begin{alignat*}\n\t@1@\n\\end{alignat*}"
	},
	{
		"name": "array",
		"description": "Used to create an array (matrix),\nwhere columns can be individually left-justified,\ncentered, or right-justified.\n\nsuppose that $n$ columns are desired in the array;\nthen, $n-1$ ampersands are used to separate the columns\n\nthe array environment is started with \u00a0 \\begin{array}{<justification info>}\u00a0,\nwhere \u00a0 <justification info> \u00a0 is a series of $n$ letters, one for each column:\n\n\u2018l\u2019 for left-justified\n\u2018c\u2019 for centered\n\u2018r\u2019 for right-justified\n\npipe character(s) \u2018|\u2019 can be used in the justification information to specify\noptional separating vertical line(s) (see example below)\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows\n\nCompare these scenarios:\n\nboth columns left-justified:\n\n\\begin{array}{ll}\naaa & b\\cr\nc   & ddd\n\\end{array}\n\nyields\n$$\n\\begin{array}{ll}\naaa & b\\cr\nc   & ddd\n\\end{array}\n$$\n\nboth columns right-justified:\n\n\\begin{array}{rr}\naaa & b\\cr\nc   & ddd\n\\end{array}\n\nyields\n$$\n\\begin{array}{rr}\naaa & b\\cr\nc   & ddd\n\\end{array}\n$$\n\nboth columns centered, with separating line:\n\n\\begin{array}{c|c}\naaa & b\\cr\nc   & ddd\n\\end{array}\n\nyields\n$$\n\\begin{array}{c|c}\naaa & b\\cr\nc   & ddd\n\\end{array}\n$$\n\nfirst column left-justified; second column right-justified:\n\n\\begin{array}{lr}\naaa & b\\cr\nc & ddd\n\\end{array}\n\nyields\n$$\n\\begin{array}{lr}\naaa & b\\cr\nc & ddd\n\\end{array}\n$$\n\nPutting a pipe character \u2018|\u2019 at the beginning or end of\nthe justification info encloses the entire structure,\nwhich is different from standard $\\,\\rm\\TeX\\,$:\n\n\\begin{array}{|lr}\naaa & b\\cr\nc & ddd\n\\end{array}\n\nyields\n$$\n\\begin{array}{|lr}\naaa & b\\cr\nc & ddd\n\\end{array}\n$$",
		"examples": "",
		"see_also": [
			"\\begin{matrix}",
			"\\begin{subarray}"
		],
		"snippet": "\\begin{array}\n\t@1@\n\\end{array}"
	},
	{
		"name": "Bmatrix",
		"description": "Used to create a matrix (an array) with braces $\\{\\,,\\,\\}$ as enclosing delimiters;\ncolumns are centered.\n\nsuppose that $n$ columns are desired in the array;\nthen, $n-1$ ampersands are used to separate the columns\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": [
			"\n\\begin{Bmatrix}\naaa & b\\cr\nc   & ddd\n\\end{Bmatrix}\n"
		],
		"see_also": [
			"\\begin{array}",
			"\\begin{matrix}"
		],
		"snippet": "\\begin{Bmatrix}\n\t@1@\n\\end{Bmatrix}"
	},
	{
		"name": "bmatrix",
		"description": "Used to create a matrix (an array) with brackets $[\\,,\\,]$ as enclosing delimiters;\ncolumns are centered.\n\nsuppose that $n$ columns are desired in the array;\nthen, $n-1$ ampersands are used to separate the columns\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": [
			"\n\\begin{bmatrix}\naaa & b\\cr\nc   & ddd\n\\end{bmatrix}\n"
		],
		"see_also": [
			"\\begin{array}",
			"\\begin{matrix}"
		],
		"snippet": "\\begin{bmatrix}\n\t@1@\n\\end{bmatrix}"
	},
	{
		"name": "cases",
		"description": "Used for piecewise-defined functions\n\nan ampersand \u2018&\u2019 is used to separate the function cases and their definitions\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": [
			"\n|x| =\n\\begin{cases}\nx  & \\text{ if } x\\ge 0 \\\\\n-x & \\text{ if } x \\lt 0\n\\end{cases}\n"
		],
		"see_also": [
			"\\cases"
		],
		"snippet": "\\begin{cases}\n\t@1@\n\\end{cases}"
	},
	{
		"name": "eqnarray",
		"description": "for \u2018equation arrays\u2019;\naligns at one or more places;\nsurround the character(s) to be aligned with ampersands, as shown below;\ncontent between alignment characters (or between alignment characters and end-of-line) is left-justified;\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": "",
		"see_also": [],
		"snippet": "\\begin{eqnarray}\n\t@1@\n\\end{eqnarray}"
	},
	{
		"name": "eqnarray*",
		"description": "[May 2011] same as equarray",
		"examples": "",
		"see_also": [],
		"snippet": "\\begin{eqnarray*}\n\t@1@\n\\end{eqnarray*}"
	},
	{
		"name": "equation",
		"description": "[May 2011] ignored, until MathJax implements automatic numbering",
		"examples": "",
		"see_also": [],
		"snippet": "\\begin{equation}\n\t@1@\n\\end{equation}"
	},
	{
		"name": "equation*",
		"description": "[May 2011] ignored",
		"examples": "",
		"see_also": [],
		"snippet": "\\begin{equation*}\n\t@1@\n\\end{equation*}"
	},
	{
		"name": "gather",
		"description": "to display any number of centered formulas (without any alignment);\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows;\nindividual lines may be tagged using the \\tag{} command:\n\ndefault input for \u00a0\\tag{}\u00a0 is text\n\nyou may get mathematical content inside \u00a0\\tag{}\u00a0 by using math delimiters;\ne.g., \\tag{$\\alpha$}",
		"examples": "",
		"see_also": [
			"\\displaylines"
		],
		"snippet": "\\begin{gather}\n\t@1@\n\\end{gather}"
	},
	{
		"name": "gather*",
		"description": "[May 2011] same as gather",
		"examples": "",
		"see_also": [],
		"snippet": "\\begin{gather*}\n\t@1@\n\\end{gather*}"
	},
	{
		"name": "matrix",
		"description": "Used to create a matrix (an array) without any enclosing delimiters;\ncolumns are centered.\n\nsuppose that $n$ columns are desired in the array;\nthen, $n-1$ ampersands are used to separate the columns\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": [
			"\n\\begin{matrix}\naaa & b\\cr\nc   & ddd\n\\end{matrix}\n"
		],
		"see_also": [
			"\\begin{array}"
		],
		"snippet": "\\begin{matrix}\n\t@1@\n\\end{matrix}"
	},
	{
		"name": "multline",
		"description": "a multi-line environment;\ntypically used for formulas/equations that don't fit on a single line\n\nthe first (or only) line is displayed left-justified\nthe last line is displayed right-justified\nany intermediate line(s) are centered\n\nThe justification of intermediate lines can be adjusted with\n\\shoveleft and \\shoveright.",
		"examples": "",
		"see_also": [
			"\\begin{split}"
		],
		"snippet": "\\begin{multline}\n\t@1@\n\\end{multline}"
	},
	{
		"name": "multline*",
		"description": "[May 2011] same as multline",
		"examples": "",
		"see_also": [
			"\\shoveleft",
			"\\shoveright"
		],
		"snippet": "\\begin{multline*}\n\t@1@\n\\end{multline*}"
	},
	{
		"name": "pmatrix",
		"description": "Used to create a matrix (an array) with parentheses $(\\,,\\,)$ as enclosing delimiters;\ncolumns are centered.\n\nsuppose that $n$ columns are desired in the array;\nthen, $n-1$ ampersands are used to separate the columns\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": [
			"\n\\begin{pmatrix}\naaa & b\\cr\nc   & ddd\n\\end{pmatrix}\n"
		],
		"see_also": [
			"\\begin{array}",
			"\\begin{matrix}"
		],
		"snippet": "\\begin{pmatrix}\n\t@1@\n\\end{pmatrix}"
	},
	{
		"name": "smallmatrix",
		"description": "Used to create a small matrix (an array);\nparticularly suited for use in text;\ncolumns are centered.\n\nsuppose that $n$ columns are desired in the array;\nthen, $n-1$ ampersands are used to separate the columns\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": [
			"\nthe matrix\n$\\begin{smallmatrix}\naaa & b\\cr\nc   & ddd\n\\end{smallmatrix}$\nis...\n",
			"\n\\left[\n\\begin{smallmatrix}\naaa & b\\cr\nc   & ddd\n\\end{smallmatrix}\n\\right]\n",
			"\n\\left[\n\\begin{smallmatrix}\naaa & b\\cr\nc   & ddd\n\\end{smallmatrix}\n\\right]\n"
		],
		"see_also": [
			"\\begin{array}",
			"\\begin{matrix}"
		],
		"snippet": "\\begin{smallmatrix}\n\t@1@\n\\end{smallmatrix}"
	},
	{
		"name": "split",
		"description": "for single equations that are too long to \ufb01t on one line, and hence must be split into multiple lines;\nallows for (optional) alignment at one or more places, using \u2018&\u2019 to mark alignment points",
		"examples": "",
		"see_also": [
			"\\begin{multline}"
		],
		"snippet": "\\begin{split}\n\t@1@\n\\end{split}"
	},
	{
		"name": "subarray",
		"description": "a more compact version of \\begin{array};\ncan be used for multi-subscripts and multi-superscripts on large operators;\ncolumns can be individually left-justified,\ncentered, or right-justified\n\nsuppose that $n$ columns are desired in the subarray;\nthen, $n-1$ ampersands are used to separate the columns\n\nthe subarray environment is started with \u00a0 \\begin{subarray}{<justification info>}\u00a0,\nwhere \u00a0 <justification info> \u00a0 is a series of $n$ letters, one for each column:\n\n\u2018l\u2019 for left-justified\n\u2018c\u2019 for centered\n\u2018r\u2019 for right-justified\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": "",
		"see_also": [
			"\\substack",
			"\\begin{array}"
		],
		"snippet": "\\begin{subarray}{@1@}\n\t@2@\n\\end{subarray}"
	},
	{
		"name": "Vmatrix",
		"description": "Used to create a matrix (an array) with $\\|\\,,\\,\\|$ as enclosing delimiters;\ncolumns are centered.\n\nsuppose that $n$ columns are desired in the array;\nthen, $n-1$ ampersands are used to separate the columns\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": [
			"\n\\begin{Vmatrix}\naaa & b\\cr\nc   & ddd\n\\end{Vmatrix}\n"
		],
		"see_also": [
			"\\begin{array}",
			"\\begin{matrix}"
		],
		"snippet": "\\begin{Vmatrix}\n\t@1@\n\\end{Vmatrix}"
	},
	{
		"name": "vmatrix",
		"description": "Used to create a matrix (an array) with $|\\,,\\,|$ as enclosing delimiters;\ncolumns are centered.\n\nsuppose that $n$ columns are desired in the array;\nthen, $n-1$ ampersands are used to separate the columns\n\na double backslash \u2018\\\\\u2019 or carriage return \u2018\\cr\u2019 separates rows",
		"examples": [
			"\n\\begin{vmatrix}\naaa & b\\cr\nc   & ddd\n\\end{vmatrix}\n"
		],
		"see_also": [
			"\\begin{array}",
			"\\begin{matrix}"
		],
		"snippet": "\\begin{vmatrix}\n\t@1@\n\\end{vmatrix}"
	}
]
