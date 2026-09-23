(() => {
  const sizes = [100, 50, 30, 20, 15];
  const $ = id => document.getElementById(id);
  const people = $("people"), days = $("days"), per = $("per");

  const fmt = n => new Intl.NumberFormat("es-AR", {maximumFractionDigits: 2}).format(n);

  // Encuentra la combinación óptima sin hacer búsquedas pesadas.
  // Primero minimiza excedente; después, cantidad de boxes.
  function bestBoxes(rawNeed) {
    const need = Math.max(0, Math.ceil(rawNeed));
    if (!need) return { counts:[0,0,0,0,0], total:0, count:0, extra:0 };

    // Con tamaños 15/20/30/50/100, basta revisar un margen pequeño.
    for (let total = need; total <= need + 19; total++) {
      let best = null;

      // Como 100 es el box mayor, probamos sólo unas pocas alternativas
      // alrededor del máximo posible; el resto se resuelve con 50/30/20/15.
      const max100 = Math.floor(total / 100);
      const min100 = Math.max(0, max100 - 2);

      for (let a = max100; a >= min100; a--) {
        const remA = total - a * 100;
        for (let b = Math.floor(remA / 50); b >= 0; b--) {
          const remB = remA - b * 50;
          for (let c = Math.floor(remB / 30); c >= 0; c--) {
            const remC = remB - c * 30;
            for (let d = Math.floor(remC / 20); d >= 0; d--) {
              const remD = remC - d * 20;
              if (remD % 15 !== 0) continue;
              const e = remD / 15;
              const count = a+b+c+d+e;
              if (!best || count < best.count) {
                best = {counts:[a,b,c,d,e], total, count, extra:total-rawNeed};
              }
            }
          }
        }
      }
      if (best) return best;
    }

    // Respaldo seguro: boxes de 100.
    const count = Math.ceil(need / 100);
    return {counts:[count,0,0,0,0], total:count*100, count, extra:count*100-rawNeed};
  }

  function describe(r) {
    if (!r || !r.count) return "0 boxes";
    return r.counts
      .map((n,i) => n ? `${n} × Box ${sizes[i]}` : "")
      .filter(Boolean).join(" + ");
  }

  function setResult(prefix, need, result) {
    $(prefix+"snacks").textContent = fmt(need);
    $(prefix+"boxes").textContent = describe(result);
    $(prefix+"total").textContent =
      `${fmt(result.count)} ${result.count === 1 ? "box" : "boxes"} · ${fmt(result.total)} snacks`;
    $(prefix+"extra").textContent =
      result.extra > 0.0001 ? `+ ${fmt(result.extra)} snacks de margen` : "Cantidad exacta · sin excedente";
  }

  function numberValue(el, max, integer=false) {
    if (el.value.trim() === "") return 0;
    let n = Number(el.value.replace(",", "."));
    if (!Number.isFinite(n)) return 0;
    n = Math.max(0, Math.min(max, n));
    return integer ? Math.floor(n) : n;
  }

  function render() {
    const p = numberValue(people, 100000, true);
    const d = numberValue(days, 5, true);
    const s = numberValue(per, 100, false);

    const weekly = p * d * s;
    const monthDays = d * 4;
    const monthly = p * monthDays * s;

    $("wdays").textContent = `${d} ${d === 1 ? "día" : "días"}`;
    $("mdays").textContent = `${monthDays} ${monthDays === 1 ? "día" : "días"}`;

    setResult("w", weekly, bestBoxes(weekly));
    setResult("m", monthly, bestBoxes(monthly));
  }

  // Pequeño debounce: evita recalcular varias veces mientras se está escribiendo.
  let timer;
  function scheduleRender() {
    clearTimeout(timer);
    timer = setTimeout(render, 80);
  }

  [people, days, per].forEach(el => {
    el.addEventListener("input", scheduleRender);
    el.addEventListener("change", render);
  });

  render();
})();