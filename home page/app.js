class RangeSlider {
  constructor(qs) {
    this.input = document.querySelector(qs);
    this.input?.addEventListener("input", this.update.bind(this));
    this.update();
  }
  update(e) {
    console.log("here");
    let value = this.input.value;

    // when manually set
    if (e) value = e.target?.value;
    // when initiated
    else this.input.value = value;

    const min = this.input.min || 0;
    const max = this.input.max || 100;
    const percentRaw = ((value - min) / (max - min)) * 100;
    const percent = +percentRaw.toFixed(2);
    const handle = 1.5 * (1 - percent / 100) - 1.125;
    const percentStyle = `calc(${percent}% + ${handle}em)`;

    this.input.parentElement?.style.setProperty("--percent", percentStyle);
  }
}

const YEAR_START = 2000;
const YEAR_END = 2022;
const AMOUNT_MIN = 10000;
const AMOUNT_STEP = 10000;
const AMOUNT_MAX = 2000000;
let dirty = false;

const monthNames = {
  "01": "一月",
  "02": "二月",
  "03": "三月",
  "04": "四月",
  "05": "五月",
  "06": "六月",
  "07": "七月",
  "08": "八月",
  "09": "九月",
  10: "十月",
  11: "十一月",
  12: "十二月",
};

const $ = (selector) => {
  const elements = document.querySelectorAll(selector);

  if (elements.length === 1) {
    return elements[0];
  } else if (elements.length > 1) {
    return elements;
  } else {
    return null;
  }
};

const zeroPad = (num, places) => String(num).padStart(places, "0");
const useYearAndMonth = (s) => s.split("-");
const stepOne = $("#step-1");
const stepTwo = $("#step-2");
const stepThree = $("#step-3");

let state = {
  unit: localStorage.getItem("unit") || "year", // 'year', 'month'
  step: 1,
  start: parseInt(localStorage.getItem("start")) || YEAR_START, // '2000'
  range: parseInt(localStorage.getItem("range")) || 0, // '2022'
  from: localStorage.getItem("from") || `${YEAR_START}-01`, // '2000-01'
  to: localStorage.getItem("to") || `${YEAR_END}-12`, // '2022-12'
  amount: parseInt(localStorage.getItem("amount")) || AMOUNT_MIN, // '10000'
};

if (!window.location.href.endsWith("trialUnit.html")) {
  if (state.unit === null) {
    window.location.href = "trialUnit.html";
  }
}

// Step 1. Choose a unit -------------------------------------------------------
if (window.location.href.endsWith("trialUnit.html")) {
  const trialUnitNext = $("#trial-unit-next");
  state.step = 1;
  stepOne.style.backgroundColor = "#ffffff";
  stepOne.style.color = "#ffffff";

  if (localStorage.getItem("unit") === null) {
    localStorage.setItem("unit", state.unit);
  }
  if (localStorage.getItem("start") === null) {
    localStorage.setItem("start", state.start);
  }

  if (state.unit === "year") {
    $("#radio-year").checked = true;
    trialUnitNext.disabled = false;
  } else if (state.unit === "month") {
    $("#radio-month").checked = true;
    trialUnitNext.disabled = false;
  }

  const yearLabel = $("#radio-year-label");
  const monthLabel = $("#radio-month-label");

  $("#unit-border-year").addEventListener("click", (e) => {
    yearLabel.style.backgroundColor = "#d9d9d9";
    monthLabel.style.backgroundColor = "transparent";
  });
  $("#unit-border-month").addEventListener("click", (e) => {
    yearLabel.style.backgroundColor = "transparent";
    monthLabel.style.backgroundColor = "#d9d9d9";
  });

  $("#unit-border-year").addEventListener("change", (e) => {
    if (e.target.nodeName.toLowerCase() === "input") {
      state.unit = e.target.value;
      localStorage.setItem("unit", state.unit);
      if (state.unit !== null) {
        $("#trial-unit-next").disabled = false;
      }
    }
  });
  $("#unit-border-month").addEventListener("change", (e) => {
    if (e.target.nodeName.toLowerCase() === "input") {
      state.unit = e.target.value;
      localStorage.setItem("unit", state.unit);
      if (state.unit !== null) {
        $("#trial-unit-next").disabled = false;
      }
    }
  });

  trialUnitNext.addEventListener("click", (e) => {
    e.preventDefault();
    if (state.unit === "year") {
      window.location.href = "periodOfYear.html";
    } else if (state.unit === "month") {
      window.location.href = "periodOfMonth.html";
    }
  });
}

// Step 2a. Choose a period of year --------------------------------------------
if (window.location.href.endsWith("periodOfYear.html")) {
  const periodYearNext = $("#period-year-next");
  const periodYearPrev = $("#period-year-prev");
  const selectStartYear = $("#start-year");
  const divEndYear = $("#end-year");
  const inputYearRange = $("#year-range");
  state.step = 2;

  stepOne.style.backgroundColor = "#a6a6a6";
  stepOne.style.color = "#ffffff";
  stepTwo.style.backgroundColor = "#ffffff";
  stepTwo.style.color = "#ffffff";

  localStorage.setItem("start", state.start);
  localStorage.setItem("range", state.range);
  if (state.start !== null && state.range !== null) {
    $("#period-year-next").disabled = false;
  }

  for (let i = YEAR_START; i <= YEAR_END; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectStartYear.appendChild(option);
  }
  divEndYear.textContent = state.start + state.range;

  inputYearRange.min = 0;
  inputYearRange.max = YEAR_END - state.start;
  selectStartYear.value = state.start;
  inputYearRange.value = state.range;

  const yearRange = new RangeSlider("#year-range");

  selectStartYear.addEventListener("change", (e) => {
    state.start = parseInt(e.target.value);
    localStorage.setItem("start", state.start);
    state.range = 0;
    inputYearRange.value = state.range;
    inputYearRange.max = YEAR_END - state.start;
    localStorage.setItem("range", state.range);
    divEndYear.textContent = state.start + state.range;
  });
  inputYearRange.addEventListener("input", (e) => {
    // inputYearRange.max = YEAR_END - state.start;
    state.range = parseInt(e.target.value);
    localStorage.setItem("range", state.range);
    divEndYear.textContent = state.start + state.range;
  });

  periodYearNext.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "initialAmount.html";
  });
  periodYearPrev.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
  });
}

// Step 2b. Choose a period of month -------------------------------------------
if (window.location.href.endsWith("periodOfMonth.html")) {
  const periodYearAndMonthNext = $("#period-month-next");
  const periodYearAndMonthPrev = $("#period-month-prev");
  const selectStartYear = $("#start-year");
  const selectEndYear = $("#end-year");
  const inputStartMonth = $("#start-month");
  const inputEndMonth = $("#end-month");
  const divStartMonth = $("#start-month-value");
  const divEndMonth = $("#end-month-value");

  let startYear = YEAR_START;
  let startMonth = 1;
  let endYear = YEAR_END;
  let endMonth = 12;
  state.step = 2;

  stepOne.style.backgroundColor = "#a6a6a6";
  stepOne.style.color = "#ffffff";
  stepTwo.style.backgroundColor = "#ffffff";
  stepTwo.style.color = "#ffffff";

  state.from = `${startYear}-${zeroPad(startMonth, 2)}`;
  state.to = `${endYear}-${zeroPad(endMonth, 2)}`;

  if (localStorage.getItem("from") === null) {
    localStorage.setItem("from", state.from);
  }
  if (localStorage.getItem("to") === null) {
    localStorage.setItem("to", state.to);
  }

  if (state.start !== null && state.range !== null) {
    periodYearAndMonthNext.disabled = false;
  }

  for (let i = YEAR_START; i <= YEAR_END; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectStartYear.appendChild(option);
  }
  for (let i = YEAR_START; i <= YEAR_END; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectEndYear.appendChild(option);
  }
  inputStartMonth.value = startMonth;
  inputEndMonth.value = endMonth;
  selectStartYear.value = startYear;
  selectEndYear.value = endYear;
  divStartMonth.textContent = monthNames[zeroPad(startMonth, 2)];
  divEndMonth.textContent = monthNames[zeroPad(endMonth, 2)];

  const startMonthRange = new RangeSlider("#start-month");
  const endMonthRange = new RangeSlider("#end-month");

  selectStartYear.addEventListener("change", (e) => {
    startYear = parseInt(e.target.value);
    if (startYear > endYear) {
      endYear = startYear;
      selectEndYear.value = endYear;
      endMonth = 12;
      inputEndMonth.value = endMonth;

      to = `${endYear}-${zeroPad(endMonth, 2)}`;
      localStorage.setItem("to", to);
      state.to = to;
    }
    if (startYear === endYear && startMonth >= endMonth) {
      startMonth = 1;
      inputStartMonth.value = startMonth;

      from = `${startYear}-${zeroPad(startMonth, 2)}`;
      localStorage.setItem("from", from);
      state.from = from;
    }
    startMonthRange.update();
    endMonthRange.update();

    from = `${startYear}-${zeroPad(startMonth, 2)}`;
    localStorage.setItem("from", from);
    state.from = from;
  });
  selectEndYear.addEventListener("change", (e) => {
    endYear = parseInt(e.target.value);

    if (startYear > endYear) {
      startYear = endYear;
      selectStartYear.value = startYear;
      startMonth = 1;
      inputStartMonth.value = startMonth;

      from = `${startYear}-${zeroPad(startMonth, 2)}`;
      localStorage.setItem("from", from);
      state.from = from;
    }
    if (startYear === endYear && startMonth >= endMonth) {
      endMonth = 12;
      inputEndMonth.value = endMonth;

      from = `${startYear}-${zeroPad(startMonth, 2)}`;
      localStorage.setItem("from", from);
      state.from = from;
    }
    startMonthRange.update();
    endMonthRange.update();

    to = `${endYear}-${zeroPad(endMonth, 2)}`;
    localStorage.setItem("to", to);
    state.to = to;
  });
  inputStartMonth.addEventListener("input", (e) => {
    startMonth = parseInt(e.target.value);

    if (startYear === endYear && startMonth >= endMonth) {
      if (endMonth === 12 && startMonth === 12) {
        // startMonth = 11;
        inputStartMonth.value = startMonth;
      } else {
        endMonth = startMonth;
        inputEndMonth.value = endMonth;
        divEndMonth.textContent = monthNames[zeroPad(endMonth, 2)];
      }
      startMonthRange.update();
      endMonthRange.update();

      to = `${endYear}-${zeroPad(endMonth, 2)}`;
      localStorage.setItem("to", to);
      state.to = to;
    }

    from = `${startYear}-${zeroPad(startMonth, 2)}`;
    divStartMonth.textContent = monthNames[zeroPad(startMonth, 2)];
    localStorage.setItem("from", from);
    state.from = from;
  });
  inputEndMonth.addEventListener("input", (e) => {
    endMonth = parseInt(e.target.value);

    if (startYear === endYear && startMonth >= endMonth) {
      if (endMonth === 1 && startMonth === 1) {
        // endMonth = 2;
        inputEndMonth.value = endMonth;
      } else {
        startMonth = endMonth;
        inputStartMonth.value = startMonth;
        divStartMonth.textContent = monthNames[zeroPad(startMonth, 2)];
      }
      startMonthRange.update();
      endMonthRange.update();

      from = `${startYear}-${zeroPad(startMonth, 2)}`;
      localStorage.setItem("from", from);
      state.from = from;
    }

    to = `${endYear}-${zeroPad(endMonth, 2)}`;
    divEndMonth.textContent = monthNames[zeroPad(endMonth, 2)];
    localStorage.setItem("to", to);
    state.to = to;
  });

  periodYearAndMonthNext.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "initialAmount.html";
  });
  periodYearAndMonthPrev.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
  });
}

// Step 3. Choose initial amount -----------------------------------------------
if (window.location.href.endsWith("initialAmount.html")) {
  state.step = 3;

  stepTwo.style.backgroundColor = "#a6a6a6";
  stepTwo.style.color = "#ffffff";
  stepOne.style.backgroundColor = "#a6a6a6";
  stepOne.style.color = "#ffffff";
  stepThree.style.backgroundColor = "#ffffff";
  stepThree.style.color = "#ffffff";

  const amountNext = $("#initial-amount-next");
  const amountPrev = $("#initial-amount-prev");
  const amountRange = $("#initial-amount-range");
  const amountInput = $("#initial-amount-input");

  amountInput.min = AMOUNT_MIN;
  amountInput.max = AMOUNT_MAX;
  amountInput.step = AMOUNT_STEP;
  amountRange.min = AMOUNT_MIN;
  amountRange.max = AMOUNT_MAX;
  amountRange.step = AMOUNT_STEP;

  amountInput.value = state.amount;
  amountRange.value = state.amount;
  localStorage.setItem("amount", state.amount);
  amountNext.disabled = false;

  const initialAmountRange = new RangeSlider("#initial-amount-range");

  amountInput.addEventListener("input", (e) => {
    state.amount = parseInt(e.target.value);
    localStorage.setItem("amount", state.amount);
    amountRange.value = state.amount;
    amountNext.disabled = false;
    initialAmountRange.update();
  });
  amountRange.addEventListener("input", (e) => {
    state.amount = parseInt(e.target.value);
    localStorage.setItem("amount", state.amount);
    amountInput.value = state.amount;
    amountNext.disabled = false;
  });

  amountNext.addEventListener("click", (e) => {
    e.preventDefault();
    if (state.unit === "year") {
      alert(
        `Trial unit: ${state.unit}\nPeriod of year: ${state.start} - ${
          state.start + state.range
        },\nInitial amount is ${state.amount}\n\n您已完成`
      );
    } else if (state.unit === "month") {
      alert(
        `Trial unit: ${state.unit}\nPeriod of month: ${state.from} - ${state.to},\nInitial amount is ${state.amount}\n\n您已完成`
      );
    }
  });
  amountPrev.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
  });
}
