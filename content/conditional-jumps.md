---
title: Conditional Jumps
description: Wie schreibe ich eine perfekte if-Anweisung?
date: "2022-11-23"
thumbnail: conditional-jumps.webp
photoBy:
  name: Warren Wong
  url: https://unsplash.com/@wflwong
---

Hast du dich schon einmal gefragt, ob es einen Unterschied macht, wie genau du eine if-Anweisung schreibst?

Ich habe mich mit Branch Prediction und Speculative Execution beschäftigt, da das viel zu wenige Programmierer verstehen und auch anwenden.

## Worum geht es eigentlich?

**Beispiel:**

Annahme: In einer Variable `x` steht eine Zahl. Diese muss positiv sein, sonst funktioniert die Weiterverarbeitung nicht.

Jetzt gibt es zwei Möglichkeiten:

```javascript
if (x < 0) {
  throw new Error("x must be positive");
}

// mache etwas mit x
```

oder

```javascript
if (x >= 0) {
  // mache etwas mit x
} else {
  throw new Error("x must be positive");
}
```

Welche Unterschiede bestehen zwischen diesen beiden Varianten?

Die erste finde ich persönlich einfacher lesbar, da sie weniger verschachtelt ist.
Hier geht es mir aber um einen ganz anderen Aspekt, nämlich die Performance.

## Instruction Pipelines

Ein Computerprogramm besteht aus mehreren Anweisungen, die nacheinander ausgeführt werden sollen.
Frühe Computer haben zuerst eine Anweisung vollständig ausgeführt, bevor die nächste Anweisung überhaupt geladen wurde.

Moderne CPUs verwenden sogenannte Instruction Pipelines,
dabei kann die nächste Anweisung bereits geladen werden,
bevor die vorherige Anweisung vollständig ausgeführt wurde.

Dabei entsteht ein Problem,
wenn eine Anweisung eine Bedingung prüft,
welche auf vorherigen Anweisungen basiert,
denn diese Anweisungen sind eventuell noch nicht vollständig ausgeführt worden.

## Branch Prediction

Um dieses Problem zu lösen, verwenden moderne CPUs sogenannte Branch Prediction.
Dabei wird eine Annahme getroffen,
in welchem Zweig die Anweisung weitergeführt wird,
bevor die Bedingung überhaupt geprüft wurde. \cite{baeldung-java-branch-prediction}

Die CPU kann dabei falsch liegen.
Wenn die Annahme falsch ist,
muss die Anweisung zurückgesetzt werden und der andere Zweig ausgeführt werden.

## Speculative Execution

Um die Performance noch weiter zu verbessern, wird Speculative Execution verwendet.
