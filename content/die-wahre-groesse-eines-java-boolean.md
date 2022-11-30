---
title: Die wahre Größe eines Java boolean
description: Wie viel Speicherplatz verbraucht ein boolean in Java?
date: "2022-12-01"
thumbnail: die-wahre-groesse-eines-java-boolean.webp
prerelease: true
photoBy:
  name: Benjamin Lehman
  url: https://unsplash.com/@benjaminlehman
---

## Was ist das Problem?

Ich wurde von einer Kommilitonin gefragt, wie groß denn ein `boolean` in Java ist. Für mich war die naheliegenste Antwort 1 Byte, da das die kleinste adressierbare Einheit ist. Um sicher zu gehen habe ich kurz recherchiert. Verschiedene vertrauenswürdige Quellen wie W3Schools [^w3-schools-java-data-types] sagen, dass ein `boolean` in Java 1 Bit Speicher verbraucht. Das kann aber nicht die ganze Wahrheit sein, da das wie gesagt nicht adressierbar wäre.

In der Java Dokumentation habe ich den Grund für die Verwirrung gefunden:

> boolean: The boolean data type has only two possible values: true and false. Use this data type for simple flags that track true/false conditions. This data type represents one bit of information, but its "size" isn't something that's precisely defined. [^jls-4-2-1]

Es ist klar, dass ein `boolean` mindestens einen Bit verbraucht um die beiden Werte `true` und `false` abbilden zu können. Um adressiert werden zu können braucht er mindestens einen Byte, also 8 Bit. Aber wie viel Speicher tatsächlich verbraucht wird, liegt bei der JVM-Implementation.

## Oracle JVM

Die JVM von Oracle behandelt einzelne `boolean` als einen `int`, der nur `0` oder `1` speichern kann. Bei einem Array von `boolean` verhält sich das leicht anders. Die Oracle JVM verwendet hier das Minimum von einem Byte pro `boolean`. [^javase-jvm-boolean]

## Open JDK

Die Open JDK behandelt die Typen `boolean`, `byte`, `short` und `char` auf dem Stack als `int` [^openjdk-types-cleanup-jvms], also mit einer Größe von 4 Byte.
