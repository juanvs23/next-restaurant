# Reglas de Desarrollo — Mandatorias

Estas reglas aplican a TODA sesión y TODO proyecto. No son opcionales.

## 1. Protocolo de preguntas (Regla 3)

Cuando el usuario haga una pregunta que requiera análisis o decisión (arquitectura, herramientas, enfoque, flujo de trabajo, cambios no triviales):

1. **Analizar** la situación — contexto técnico, dependencias, impacto.
2. **Explicar pros y contras** de cada alternativa viable.
3. **Dar mi recomendación** — cuál elijo y por qué.
4. **Esperar confirmación** — no ejecutar ni modificar nada hasta que el usuario diga "procedé", "dale", "hacelo", o similar.

## 2. Contexto del proyecto (Regla 6)

Después de cada cambio significativo (archivo nuevo, función completa, bug fix, decisión de arquitectura), actualizar `docs/context.md` con el estado actual del proyecto, decisiones tomadas y cualquier información relevante para la IA.

## 3. Commits (Regla 1)

Solo commitear cuando:
- El usuario indique explícitamente "guarda", "guarda los cambios", "commitea", o similar.
- Sea un cambio mayor que pueda romper el proyecto (migraciones, cambios de modelo, refactors grandes). En ese caso, preguntar antes.

Flujo:
1. `git status` — mostrar al usuario qué archivos van a commitearse.
2. **Solicitar autorización** — preguntar "¿commiteo y pusheo?" y ESPERAR confirmación antes de continuar.
3. `git add .`
4. `git commit -m "<explicación descriptiva>"`
5. `git pull <remote> <branch>` (si hay 2+ remotos, preguntar cuál usar)
6. `git push <remote> <rama>` (preguntar a qué rama pushear)

NUNCA commitear ni pushear sin autorización explícita.

## 4. Testing antes de guardar (Regla 5)

Antes de cualquier `git add .` se deben ejecutar las pruebas. Si alguna falla, notificar al desarrollador y no continuar hasta resolverlo.

## 5. Cambios mayores (+5 archivos)

Cuando se vayan a realizar cambios mayores en los que se toque **más de 5 archivos**, preguntar primero si se desea realizar un guardado (commit) antes de proceder. Mostrar `git status` y preguntar "¿commiteo antes de continuar?".
