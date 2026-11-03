# Fase M2 — Clasificación tabular

## Objetivo

Implementar el flujo principal de la aplicación móvil sin convertirla en una aplicación de consulta médica general:

1. Seleccionar un paciente activo.
2. Capturar las variables clínicas requeridas por el modelo tabular.
3. Enviar la captura al endpoint `POST /api/v1/evaluations`.
4. Mostrar la severidad tabular y sus probabilidades.
5. Conservar un historial navegable de resultados.

## Alcance implementado

- Acceso a **Nueva clasificación** desde Inicio, Clasificaciones y el detalle del paciente.
- Buscador para seleccionar al paciente.
- Edad y peso precargados desde el expediente; ambos quedan editables para registrar el valor usado en la clasificación actual.
- Captura agrupada de:
  - signos vitales;
  - trabajo respiratorio;
  - signos de alarma;
  - antecedentes y auscultación;
  - días de evolución de síntomas.
- Validación local antes de enviar los datos.
- Resultado con severidad tabular (`Bajo`, `Medio`, `Alto`) y probabilidades baja, media y alta.
- Historial de clasificaciones con acceso al detalle.

## Decisión de producto vigente

La recomendación clínica no se muestra todavía. Su contrato y sus reglas se revisarán en el backend antes de incorporarla al frontend. Tampoco se presentan módulos de citas, recetas o notas de consulta, porque no forman parte del propósito de esta aplicación.

## Siguiente bloque propuesto

- Probar el flujo completo contra el backend con casos clínicos controlados.
- Confirmar semántica y unidades de cada variable con el responsable clínico.
- Diseñar la incorporación opcional de radiografía y la presentación de concordancia, sin mezclar evidencia radiográfica no confiable.
