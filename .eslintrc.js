module.exports = {
	"parser": "babel-eslint",
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
    ],
    "rules": {
        "indent": [
            "error",
            "tab",
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
		"no-console": [
			"error",
			{ "allow": ["log", "error"] }
        ],

        // for redux
        "no-case-declarations": 0
    },
	"settings": {
		"react": {
			"version": "detect"
		}
	}
};
