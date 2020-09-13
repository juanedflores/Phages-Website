/*
 * Get the HTML for the specific navigation bar link.
 */
function getPage(filename) {
  currenturl = window.location.href;
  if (
    currenturl == "http://localhost:3000/hydraselect.html" ||
    currenturl == "http://192.168.1.76:3000/hydraselect.html" ||
    currenturl == "https://phagesofficial.com/hydraselect.html"
  ) {
    document.getElementById("vowelsgif").style.display = "none";
    document.getElementById("hydraDescription").style.display = "none";
    document.getElementById("vowelsgif").style.visibility = "hidden";
    document.getElementById("hydraDescription").style.visibility = "hidden";
  }

  window.history.replaceState("", "", "/");
  console.log("currentpage: " + currentPage);

  const fileUrl = filename; // provide file location

  fetch(fileUrl)
    .then(r => r.text())
    .then(t => (document.getElementById("contentArea").innerHTML = t))
    .then(() => document.getElementById("contentArea").scrollIntoView());
}

let h0;
let currentPage = "";

async function loadHydra() {
  if (!h0) {
    h0 = await new Hydra({
      canvas: document.getElementById("hydraCanvas"),
      makeGlobal: true,
    }).synth;

    await getHydraPage("grid");
  }
}

function getHydraPage(sketchname) {
  let isMobile = window.matchMedia("only screen and (max-width: 760px)")
    .matches;

  if (isMobile) {
    console.log("Mobile Mode");
    document.getElementById("vowelsgif").style.visibility = "visible";
    document.getElementById("vowelsgif").style.display = "block";
    document.getElementById("hydraDescription").style.visibility = "visible";
    document.getElementById("hydraDescription").style.display = "block";
  } else {
    document.getElementById("vowelsgif").style.visibility = "hidden";
    // document.getElementById("vowelsgif").style.display = "none";
  }

  currentPage = sketchname;
  if (sketchname == "grid") {
    document.getElementById("hydraDescription").innerHTML =
      "<h3 style='margin:0.5em 0em'>Grid</h3>Audio reactive grid.";
    document.getElementById("vowelsgif").src =
      "./assets/images/gifs/hydra_sketches/30_grid.gif";
    // if (!isMobile) {
    grid(h0);
    // }
  }
  if (sketchname == "vowels") {
    document.getElementById("hydraDescription").innerHTML =
      "<h3 style='margin:0.5em 0em'>Vowels</h3>Letters constructed using the built-in shape() function. Effects are triggered depending on the positions of five FFT (Fast Fourier Transform) audio bins, so it works best with various frequencies. Uses custom audio reactive functions which can be checked out <a>here</a>.";
    document.getElementById("vowelsgif").src =
      "./assets/images/gifs/hydra_sketches/30_vowels.gif";
    // if (!isMobile) {
    vowels(h0);
    // }
  }
}

let toggle = false;
let xdir = 1;
let tsnap = 0;
let psnap = 0;
let nsnap = 0;
let ran = 1;
let freq;
let noiseScale;
let slide;
let snapshot;
const fftmult = 20;
const bintotal = 5;
let fft0, fft1, fft2, fft3;
let s1, s2, s3;
let ranbin;

function GLOBAL() {
  xdir = -xdir;
  tsnap = time;

  ran = Math.random();
  freq = Math.floor(ran * 20) + 4;
  noiseScale = Math.floor(ran * 5) + 4;
  fft0 = a.fft[0] * fftmult;
  fft1 = a.fft[1] * fftmult;
  fft2 = a.fft[2] * fftmult;
  fft3 = a.fft[3] * fftmult;
  snapshot = time;
  ranbin = Math.floor(Math.random() * bintotal);
  if (ran > 0.5) {
    slide = 1;
  } else {
    slide = 0;
  }
}

function TOGGLE(bin) {
  if (a.fft[bin] && !toggle) {
    toggle = true;
    GLOBAL();
  } else if (!a.fft[bin] && toggle) {
    toggle = false;
  }
  return toggle;
}

function HIGH(bin, v) {
  tog = TOGGLE(bin);
  if (tog) {
    return v;
  } else {
    return 0;
  }
}

function LOW(bin, v) {
  tog = TOGGLE(bin);
  if (!tog) {
    return v;
  } else {
    return 0;
  }
}

function HIGHEST(bin, v) {
  const values = [];
  for (let i = 0; i < bintotal; i++) {
    values.push(a.fft[i]);
  }
  let max = values[0];
  var maxIndex = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > max) {
      maxIndex = i;
      max = values[i];
    }
  }
  tog = TOGGLE(bin);
  if (maxIndex == bin && tog) {
    return v;
  } else {
    return 0;
  }
}

function LOWEST(bin, v) {
  const values = [];
  for (let i = 0; i < bintotal; i++) {
    values.push(a.fft[i]);
  }
  let min = values[0];
  var minIndex = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] < min) {
      minIndex = i;
      min = values[i];
    }
  }
  tog = TOGGLE(bin);
  if (minIndex == bin && tog) {
    return v;
  } else {
    return 0;
  }
}

function changeDirection(bin, time, speed) {
  let value;
  TOGGLE(bin);
  tinc = ((time * speed) % 1) - ((tsnap * speed) % 1);
  if (xdir == 1) {
    value = (time * speed) % 1;
    if (nsnap) {
      value = 1 - Math.abs(nsnap) + tinc;
      psnap = value;
    }
  } else if (xdir == -1) {
    diff = (1 - ((tsnap * speed) % 1)) * -1;
    value = diff + -tinc;
    nsnap = value;
    if (psnap) {
      diff = (1 - psnap) * -1;
      value = diff + -tinc;
      nsnap = value;
    }
  }
  return value;
}

function RANBIN() {
  rb = Math.floor(Math.random() * bintotal);
  console.log(rb);
  return rb;
}

function test(hydra) {
  hydra.osc(() => LOW(0, time)).out();
}

function grid(hydra) {
  a.show();
  hydra
    .shape(2, 0.02, 0.001)
    .scrollY(0.25)
    .add(shape(2, 0.02, 0.001).scrollY(-0.25))
    .scrollY(() => changeDirection(0, time, 0.25))
    .add(
      shape(2, 0.02, 0.001)
        .rotate(Math.PI / 2)
        .scrollX(0.25)
        .add(
          shape(2, 0.02, 0.001)
            .rotate(Math.PI / 2)
            .scrollX(-0.25)
        )
        .scrollX(() => changeDirection(0, time, 0.25))
    )
    .repeat(3, 3)
    .out();
}

function vowels(hydra) {
  a.setBins(5);
  a.show();
  hydra
    .shape(4, 0.1, 0.001)
    .scrollX(() => LOWEST(3, (time % 1) * 0.01 * xdir))
    .scale(1, 6, 0.8)
    .rotate(Math.PI / 2.75)
    .scrollX(-0.1)
    .add(
      shape(4, 0.1, 0.001)
        .scrollX(() => LOWEST(3, (time % 1) * 0.01 * xdir))
        .scale(1, 6, 0.8)
        .rotate(Math.PI / -2.75)
        .scrollX(0.1)
    )
    .add(
      shape(4, 0.1, 0.001)
        .scrollY(() => LOWEST(3, (time % 1) * 0.1 * xdir))
        .scale(1, 3, 0.8)
    )
    .color(
      () => HIGHEST(0, 1),
      () => HIGHEST(0, 1),
      () => HIGHEST(0, 1)
    )
    .modulate(
      osc(
        () => LOWEST(2, freq),
        () => LOWEST(2, 0.1),
        0
      )
    )
    .modulate(
      noise(
        () => LOWEST(4, noiseScale),
        () => LOWEST(4, 0.1)
      )
    )
    .rotate(() => LOWEST(1, (time % 1) * 0.1 * xdir))

    .add(
      shape(4, 0.1, 0.001)
        .repeatY(() => LOWEST(0, (ran * 8 * time) % 1))
        .add(shape(4, 0.1, 0.001))
        .scrollX(() => LOWEST(4, (time % 1) * 0.05 * xdir))
        .scale(1, 5, 0.8)
        .add(
          shape(4, 0.1, 0.001)
            .scrollX(() => LOWEST(4, (time % 1) * 0.05 * xdir))
            .scale(1, 5, 0.8)
            .scrollY(0.2)
        )
        .add(
          shape(4, 0.1, 0.001)
            .scrollX(() => LOWEST(4, (time % 1) * 0.05 * xdir))
            .scale(1, 5, 0.8)
            .scrollY(-0.2)
        )
        .add(
          shape(4, 0.1, 0.001)
            .scrollY(() => LOWEST(4, (time % 1) * 0.1 * xdir * -1))
            .scale(1, 5, 0.8)
            .rotate(Math.PI / 2)
            .scrollX(0.2)
        )
        .color(
          () => HIGHEST(1, 1),
          () => HIGHEST(1, 1),
          () => HIGHEST(1, 1)
        )
        .modulate(
          osc(
            () => LOWEST(3, freq),
            () => LOWEST(3, 0.1),
            0
          )
        )
        .modulate(
          noise(
            () => LOWEST(2, noiseScale),
            () => LOWEST(2, 0.1)
          )
        )
    )

    .add(
      shape(4, 0.1, 0.001)
        .rotate(() => LOWEST(1, time))
        .scale(1, 6, 0.8)
        .rotate(Math.PI / 2)
        .add(
          shape(4, 0.1, 0.001)
            .scrollY(() => LOWEST(1, time * -xdir))
            .scale(1, 6, 0.8)
            .scrollY(0.2)
        )
        .add(
          shape(4, 0.1, 0.001)
            .scrollY(() => LOWEST(1, time * xdir))
            .scale(1, 6, 0.8)
            .scrollY(-0.2)
        )
        .color(
          () => HIGHEST(2, 1),
          () => HIGHEST(2, 1),
          () => HIGHEST(2, 1)
        )
        .modulate(
          osc(
            () => LOWEST(3, freq),
            () => LOWEST(3, 0.1),
            0
          )
        )
        .modulate(
          noise(
            () => LOWEST(4, noiseScale),
            () => LOWEST(4, 0.1)
          )
        )
        .modulateRepeatY(osc(() => LOWEST(0, ran * 100), 0.1, 0))
    )

    .add(
      shape(() => 26 - LOWEST(2, ran * 22), 0.5, 0.001)
        .mask(shape(25, 0.5, 0.001).invert().scale(0.7))
        .color(
          () => HIGHEST(3, 1),
          () => HIGHEST(3, 1),
          () => HIGHEST(3, 1)
        )
        .modulate(
          osc(
            () => LOWEST(0, freq),
            () => LOWEST(0, 0.1),
            0
          )
        )
        .modulate(
          noise(
            () => LOWEST(1, noiseScale),
            () => LOWEST(1, 0.1)
          )
        )
        .modulateRotate(osc(() => LOWEST(4, ran * 2000), 0.2, 0))
    )

    .add(
      shape(() => 23 - LOWEST(1, ran * 16), 0.5, 0.001)
        .mask(shape(4, 0.3, 0.001).scale(1, 4, 1).scrollY(-0.15))
        .mask(shape(25, 0.5, 0.001).invert().scale(0.7))
        .add(
          shape(4, 0.15, 0.001).scale(1, 0.51, 2).scrollX(0.215).scrollY(0.15)
        )
        .add(
          shape(4, 0.15, 0.001).scale(1, 0.51, 2).scrollX(-0.215).scrollY(0.15)
        )
        .color(
          () => HIGHEST(4, 1),
          () => HIGHEST(4, 1),
          () => HIGHEST(4, 1)
        )
        .modulate(
          osc(
            () => LOWEST(2, freq),
            () => LOWEST(2, 0.1),
            0
          )
        )
        .modulate(
          noise(
            () => LOWEST(3, noiseScale),
            () => LOWEST(3, 0.1)
          )
        )
        .scrollY(() => LOWEST(1, (time % 0.25) * 0.1 * xdir))
        .rotate(() => LOWEST(0, Math.PI * xdir))
    )
    // .modulateRepeat(noise(() => LOWEST([0, 1, 2, 3, 4].fast(0.01), ran * 2)))
    .out();
}
