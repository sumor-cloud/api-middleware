import Logger from '@sumor/logger'

// original code is en
const code = {
  trace: {},
  debug: {},
  info: {
    API_LOAD_SUCCESS: 'API loaded: {path}',
    API_LOAD_SUCCESS_WITH_FILE: 'API loaded: {path} (allow file upload)'
  },
  warn: {},
  error: {
    API_LOAD_FAILED_SYNTAX_ERROR: 'API load failed: {path}, syntax error',
    API_LOAD_FAILED_MISSING_DEFAULT: 'API load failed: {path}, missing default export'
  }
}

// languages: zh, es, ar, fr, ru, de, pt, ja, ko
const i18n = {
  zh: {
    API_LOAD_SUCCESS: 'API已加载：{path}',
    API_LOAD_SUCCESS_WITH_FILE: 'API已加载：{path}（允许文件上传）',
    API_LOAD_FAILED_SYNTAX_ERROR: 'API加载失败：{path}，语法错误',
    API_LOAD_FAILED_MISSING_DEFAULT: 'API加载失败：{path}，缺少默认导出'
  },
  es: {
    API_LOAD_SUCCESS: 'API cargada: {path}',
    API_LOAD_SUCCESS_WITH_FILE: 'API cargada: {path} (permite la carga de archivos)',
    API_LOAD_FAILED_SYNTAX_ERROR: 'Error al cargar la API: {path}, error de sintaxis',
    API_LOAD_FAILED_MISSING_DEFAULT:
      'Error al cargar la API: {path}, falta la exportación predeterminada'
  }
}
export default new Logger({
  scope: 'API',
  code,
  i18n
})
