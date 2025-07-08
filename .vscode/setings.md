{
// ⚛️ CONFIGURACIÓN REACT + VITE + EXPRESS.JS
// Configuración optimizada para WorldSkills Training

// 🎨 CONFIGURACIÓN DE EDITOR
"editor.formatOnSave": true,
"editor.formatOnPaste": true,
"editor.formatOnType": true,
"editor.codeActionsOnSave": {
"source.fixAll.eslint": "explicit",
"source.organizeImports": "explicit"
},
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.tabSize": 2,
"editor.insertSpaces": true,
"editor.detectIndentation": false,
"editor.wordWrap": "on",
"editor.minimap.enabled": true,
"editor.bracketPairColorization.enabled": true,
"editor.guides.bracketPairs": true,
"editor.inlineSuggest.enabled": true,
"editor.suggestSelection": "first",
"editor.quickSuggestions": {
"strings": true,
"comments": true,
"other": true
},

// 🔧 CONFIGURACIÓN ESPECÍFICA POR LENGUAJE
"[javascript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
"source.fixAll.eslint": "explicit"
}
},
"[typescript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
"source.fixAll.eslint": "explicit"
}
},
"[javascriptreact]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
"source.fixAll.eslint": "explicit"
}
},
"[typescriptreact]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
"source.fixAll.eslint": "explicit"
}
},
"[json]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
},
"[html]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
},
"[css]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
},
"[scss]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
},
"[markdown]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"editor.wordWrap": "on"
},

// ⚛️ CONFIGURACIÓN REACT
"emmet.includeLanguages": {
"javascript": "javascriptreact",
"typescript": "typescriptreact"
},
"emmet.triggerExpansionOnTab": true,
"typescript.preferences.quoteStyle": "single",
"javascript.preferences.quoteStyle": "single",
"typescript.updateImportsOnFileMove.enabled": "always",
"javascript.updateImportsOnFileMove.enabled": "always",
"typescript.preferences.importModuleSpecifier": "relative",
"javascript.preferences.importModuleSpecifier": "relative",

// 🚀 CONFIGURACIÓN VITE
"files.associations": {
"_.jsx": "javascriptreact",
"_.tsx": "typescriptreact",
"vite.config.js": "javascript",
"vite.config.ts": "typescript"
},

// 📦 CONFIGURACIÓN NODE.JS / EXPRESS.JS
"typescript.preferences.includePackageJsonAutoImports": "on",
"javascript.preferences.includePackageJsonAutoImports": "on",
"npm.enableRunFromFolder": true,

// 🔍 CONFIGURACIÓN ESLINT
"eslint.enable": true,
"eslint.format.enable": true,
"eslint.lintTask.enable": true,
"eslint.workingDirectories": ["frontend", "backend"],
"eslint.validate": [
"javascript",
"javascriptreact",
"typescript",
"typescriptreact"
],

// 🎯 CONFIGURACIÓN PRETTIER
"prettier.enable": true,
"prettier.requireConfig": false,
"prettier.useEditorConfig": false,
"prettier.singleQuote": true,
"prettier.semi": true,
"prettier.tabWidth": 2,
"prettier.trailingComma": "es5",
"prettier.printWidth": 80,
"prettier.bracketSpacing": true,
"prettier.arrowParens": "avoid",
"prettier.endOfLine": "lf",

// 📁 CONFIGURACIÓN DE ARCHIVOS
"files.autoSave": "onFocusChange",
"files.exclude": {
"**/node_modules": true,
"**/dist": true,
"**/build": true,
"**/.git": true,
"**/.DS_Store": true,
"**/coverage": true,
"**/.nyc_output": true,
"**/.vscode/settings.json": false
},
"files.watcherExclude": {
"**/node_modules/**": true,
"**/dist/**": true,
"**/build/**": true,
"**/.git/**": true,
"**/coverage/**": true
},
"search.exclude": {
"**/node_modules": true,
"**/dist": true,
"**/build": true,
"**/coverage": true,
"**/.git": true,
"**/.DS_Store": true
},

// 🧪 CONFIGURACIÓN DE TESTING
"jest.autoRun": "off",
"jest.showCoverageOnLoad": false,
"jest.pathToJest": "npm test",

// 🐛 CONFIGURACIÓN DE DEBUGGING
"debug.javascript.autoAttachFilter": "smart",
"debug.javascript.suggestPrettyPrinting": true,
"debug.terminal.clearBeforeReusing": true,

// 📱 CONFIGURACIÓN GIT
"git.enableSmartCommit": true,
"git.autofetch": true,
"git.confirmSync": false,
"git.enableCommitSigning": false,
"scm.defaultViewMode": "tree",

// 🌍 CONFIGURACIÓN LIVE SERVER
"liveServer.settings.donotVerifyTags": true,
"liveServer.settings.donotShowInfoMsg": true,
"liveServer.settings.CustomBrowser": "chrome",
"liveServer.settings.host": "localhost",
"liveServer.settings.port": 3000,

// 🚀 CONFIGURACIÓN PARA WORLDSKILLS
"workbench.startupEditor": "newUntitledFile",
"workbench.editor.enablePreview": false,
"workbench.editor.enablePreviewFromQuickOpen": false,
"workbench.colorTheme": "Default Dark+",
"workbench.iconTheme": "material-icon-theme",
"workbench.tree.indent": 20,
"workbench.list.smoothScrolling": true,
"workbench.editor.tabCloseButton": "right",
"workbench.editor.tabSizing": "fit",

// 🎨 CONFIGURACIÓN DE TERMINAL
"terminal.integrated.defaultProfile.linux": "zsh",
"terminal.integrated.fontSize": 14,
"terminal.integrated.cursorBlinking": true,
"terminal.integrated.cursorStyle": "line",
"terminal.integrated.scrollback": 10000,
"terminal.integrated.shell.linux": "/bin/zsh",

// 🔧 CONFIGURACIÓN ESPECÍFICA DE EXTENSIONES
"vsicons.dontShowNewVersionMessage": true,
"bracket-pair-colorizer-2.depreciation-notice": false,
"auto-rename-tag.activationOnLanguage": [
"html",
"xml",
"php",
"javascript",
"javascriptreact",
"typescript",
"typescriptreact"
],

// 🎯 CONFIGURACIÓN PARA REACT SNIPPETS
"reactSnippets.settings.prettierEnabled": true,
"reactSnippets.settings.typescript": true,

// 📦 CONFIGURACIÓN PARA IMPORTS
"typescript.suggest.autoImports": true,
"javascript.suggest.autoImports": true,
"typescript.suggest.paths": true,
"javascript.suggest.paths": true,

// 🔄 CONFIGURACIÓN DE RECARGA AUTOMÁTICA
"files.hotExit": "onExitAndWindowClose",
"window.restoreWindows": "folders",
"extensions.autoUpdate": true,

// 🎨 CONFIGURACIÓN DE COLORES ESPECÍFICOS
"workbench.colorCustomizations": {
"statusBar.background": "#005a9e",
"statusBar.noFolderBackground": "#005a9e",
"statusBar.debuggingBackground": "#ff6600",
"editorCursor.foreground": "#ffcc00",
"terminal.ansiGreen": "#00ff00",
"terminal.ansiRed": "#ff0000"
},

// 📝 CONFIGURACIÓN DE SNIPPETS PERSONALIZADOS
"editor.snippetSuggestions": "top",
"editor.tabCompletion": "on",

// 🎯 CONFIGURACIÓN ESPECÍFICA PARA COMPETENCIAS
"editor.rulers": [80, 120],
"editor.renderWhitespace": "boundary",
"editor.renderControlCharacters": true,
"editor.showFoldingControls": "always",
"editor.foldingStrategy": "indentation",

// 🔍 CONFIGURACIÓN DE BÚSQUEDA
"search.smartCase": true,
"search.globalFindClipboard": true,
"search.useIgnoreFiles": true,

// 🚀 CONFIGURACIÓN DE PERFORMANCE
"extensions.ignoreRecommendations": false,
"telemetry.telemetryLevel": "off",
"update.mode": "start",

// 🎯 CONFIGURACIÓN PARA DESARROLLO RÁPIDO
"editor.acceptSuggestionOnCommitCharacter": true,
"editor.acceptSuggestionOnEnter": "on",
"editor.quickSuggestionsDelay": 10,
"editor.suggestOnTriggerCharacters": true,
"editor.wordBasedSuggestions": "matchingDocuments",
"editor.parameterHints.enabled": true,
"editor.parameterHints.cycle": true,

// 🔧 CONFIGURACIÓN DE WORKSPACE
"extensions.autoCheckUpdates": true,
"problems.decorations.enabled": true,
"problems.showCurrentInStatus": true,

// 📁 CONFIGURACIÓN DE EXPLORADOR
"explorer.confirmDelete": false,
"explorer.confirmDragAndDrop": false,
"explorer.openEditors.visible": 1,
"explorer.sortOrder": "type",
"explorer.decorations.badges": true,
"explorer.decorations.colors": true
}
