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

Die Auswirkungen einer einzelnen Prüfung sind sehr gering.
Aber wie mit allem ist es die Summe der kleinen Probleme,
die zu einem großen Problem führen kann.

Darum ist es wichtig zu verstehen, wie die CPU mit if-Anweisungen (conditional jump) umgeht.

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
bevor die Bedingung überhaupt geprüft wurde.[^baeldung-java-branch-prediction]

Wenn die Annahme falsch ist,
muss die Anweisung zurückgesetzt werden und der andere Zweig ausgeführt werden.
Das benötigt etwa 7 CPU-Zyklen mehr als wenn die Annahme korrekt gewesen wäre.[^cloudflare-branch-predictor]
Man sollte daher darauf achten,
dass eine Bedingung so oft wie möglich auf das selbe Ergebnis evaluiert.

## Speculative Execution

Um die Performance noch weiter zu verbessern, wird Speculative Execution verwendet.
Dabei werden Aufgaben ausgeführt, die eventuell gar nicht gebraucht werden.

Wird die Aufgabe nicht gebraucht, wird sie verworfen.
Dabei werden alle Änderungen, die durch die Aufgabe vorgenommen wurden, wieder rückgängig gemacht und das Ergebnis wird verworfen.

Das macht die CPU, wenn Ressourcen frei sind, um die Ausführzeit zu verbessern.

Es gibt zwei Arten von Speculative Execution:

### Eager execution

Hier werden beide Zweige ausgeführt.
Es ist klar, dass nur einer davon benötigt wird,
daher wird das Ergabnis erst nach der Evaluierung der Bedingung festgeschrieben.[^978-3-540-64798-0]

### Predictive execution

Hierbei wird nur der Zweig ausgeführt,
welcher wahrscheinlich benötigt wird.
Das ist der Zweig, der durch die Branch Prediction vorausgesagt wurde.
Erst wenn die Bedingung geprüft wurde, wird die Änderung festgeschrieben.
Andernfalls wird sie rückgängig gemacht und der andere Zweig wird ausgeführt.[^9781558605398]
