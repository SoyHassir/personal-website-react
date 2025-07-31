const analisisDatos = [
  {
    "id": "analisis_avanzado",
    "title": "Análisis Avanzado",
    "gender": "el",
    "category": "Análisis de Datos y Pronósticos",
    "motto": "Del \"qué pasó\" al \"qué hacer\".",
    "definition": "Es un examen a los datos utilizando técnicas que van más allá del Business Intelligence tradicional para descubrir nuevas ideas, hacer predicciones y generar recomendaciones.",
    "insight": "La oportunidad estratégica reside en su capacidad para integrar la toma de decisiones basada en datos, convirtiéndose en un motor de optimización continua. El desafío principal es la calidad y disponibilidad de los datos.",
    "useCases": [
      { "title": "Salud", "text": "Predecir la probabilidad de reingreso de pacientes para asignar recursos." },
      { "title": "Finanzas", "text": "Evaluar el riesgo crediticio en tiempo real e identificar fraudes." },
      { "title": "Retail", "text": "Personalizar recomendaciones de productos y optimizar precios." }
    ]
  },
  {
    "id": "modelos_optimizacion_precios",
    "title": "Modelos de Optimización de Precios",
    "gender": "los",
    "category": "Análisis de Datos y Pronósticos",
    "motto": "Encontrar el precio perfecto con datos.",
    "definition": "Son modelos analíticos que utilizan datos para determinar y ajustar los precios de los productos con el fin de maximizar los ingresos o los beneficios.",
    "insight": "La fijación de precios es una de las palancas más poderosas para la rentabilidad. La optimización de precios permite pasar de una fijación de precios basada en la intuición a un enfoque científico. El desafío es la necesidad de grandes volúmenes de datos limpios y la capacidad analítica para construir y mantener los modelos.",
    "keyPoints": [
      "Puede aumentar significativamente los ingresos y los márgenes.",
      "Permite una respuesta rápida a los cambios del mercado y la competencia.",
      "Requiere una gran cantidad de datos de alta calidad.",
      "Existe el riesgo de perturbar a los clientes si los precios se perciben como injustos."
    ]
  },
  {
    "id": "regresion",
    "title": "Regresión",
    "gender": "la",
    "category": "Análisis de Datos y Pronósticos",
    "motto": "Entender la relación entre las variables.",
    "definition": "Es un método estadístico utilizado para modelar la relación entre una variable dependiente y una o más variables independientes. Es la base del análisis predictivo.",
    "insight": "La regresión es una de las herramientas más fundamentales en el análisis predictivo. Permite a las empresas cuantificar cómo diferentes factores influyen en un resultado. Su simplicidad (en el caso de la regresión lineal) la hace accesible, pero también puede ser una limitación si las relaciones subyacentes son más complejas.",
    "keyPoints": [
      "Fundamental para el modelado predictivo.",
      "Permite cuantificar el impacto de diferentes variables.",
      "Asume relaciones lineales que pueden no existir en la realidad.",
      "Sensible a los valores atípicos (outliers)."
    ]
  },
  {
    "id": "regresion_lineal_multiple",
    "title": "Regresión Lineal Múltiple",
    "gender": "la",
    "category": "Análisis de Datos y Pronósticos",
    "motto": "Predecir un resultado a partir de múltiples factores.",
    "definition": "Es una técnica estadística que utiliza varias variables explicativas para predecir el resultado de una variable de respuesta, modelando una relación lineal.",
    "insight": "Esta herramienta permite a las empresas construir modelos más realistas que la regresión simple, al tener en cuenta múltiples factores. Es ampliamente utilizada en econometría y finanzas. El desafío es gestionar la multicolinealidad (cuando las variables predictoras están correlacionadas entre sí), lo que puede complicar la interpretación del modelo.",
    "keyPoints": [
      "Permite construir modelos predictivos más complejos y realistas.",
      "Ampliamente utilizada en muchos campos.",
      "La interpretación puede ser compleja debido a la interacción entre variables.",
      "Requiere una cuidadosa selección de variables para evitar problemas estadísticos."
    ]
  },
  {
    "id": "series_de_tiempo",
    "title": "Series de Tiempo",
    "gender": "las",
    "category": "Análisis de Datos y Pronósticos",
    "motto": "Pronosticar el futuro basados en el pasado.",
    "definition": "Es un análisis de una secuencia de puntos de datos medidos en intervalos de tiempo sucesivos y se utiliza para identificar tendencias, estacionalidad y hacer pronósticos.",
    "insight": "El análisis de series de tiempo es fundamental para la previsión de la demanda, la planeación financiera y la gestión de inventarios. Además, permite a las empresas anticipar fluctuaciones estacionales y tendencias a largo plazo. Los modelos pueden volverse complejos y requieren una validación continua.",
    "keyPoints": [
      "Esencial para la previsión y la planeación.",
      "Ayuda a identificar tendencias y patrones estacionales.",
      "Los resultados pasados no siempre son garantía de resultados futuros.",
      "Los eventos inesperados (\"cisnes negros\") pueden invalidar los pronósticos."
    ]
  },
  {
    "id": "tamano_muestra",
    "title": "Tamaño de la Muestra",
    "gender": "el",
    "category": "Análisis de Datos y Pronósticos",
    "motto": "Cuántos datos son suficientes para confiar.",
    "definition": "Es el proceso de determinar el número de observaciones o réplicas a incluir en una muestra estadística para que sea representativa y los resultados sean confiables.",
    "insight": "Este es un concepto fundamental en la investigación y el análisis de datos. Una muestra demasiado pequeña puede llevar a conclusiones erróneas, mientras que una demasiado grande puede ser un desperdicio de recursos. El cálculo del tamaño de la muestra equilibra la necesidad de confianza estadística con las limitaciones prácticas.",
    "keyPoints": [
      "Asegura que los resultados de la investigación sean estadísticamente significativos.",
      "Optimiza el uso de recursos en la recopilación de datos.",
      "El cálculo puede ser complejo y depende de varios factores estadísticos.",
      "Una muestra mal seleccionada (sesgada) es inútil, sin importar su tamaño."
    ]
  },
  {
    "id": "augmented_analytics",
    "title": "Análisis Aumentado",
    "gender": "el",
    "category": "Análisis de Datos y Pronósticos",
    "motto": "Democratizar el análisis con IA.",
    "definition": "Es la integración de la IA en herramientas de análisis para automatizar procesos analíticos complejos y la generación de nuevas ideas, permitiendo tomar decisiones más rápidas y precisas.",
    "insight": "El Análisis Aumentado es una de las tendencias más importantes en el campo de los datos; reduce la dependencia de los científicos de datos especializados al permitir que los usuarios de negocio hagan preguntas en lenguaje natural y obtengan nuevas ideas automáticamente. La oportunidad es democratizar el análisis de datos, pero el desafío es asegurar que los usuarios comprendan las limitaciones de las ideas generadas por la IA.",
    "keyPoints": [
      "Acelera el tiempo desde los datos hasta el insight.",
      "Permite a los no expertos realizar análisis avanzados.",
      "Los usuarios pueden confiar demasiado en los resultados de la IA sin un juicio crítico.",
      "Requiere una plataforma tecnológica sofisticada."
    ]
  }
];

export default analisisDatos; 