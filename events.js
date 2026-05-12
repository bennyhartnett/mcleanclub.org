(() => {
  const startYear = 2009;
  const endYear = Math.max(2026, new Date().getFullYear());
  const excludedStartDate = new Date(2020, 2, 1, 0, 0, 0);
  const excludedEndDate = new Date(2021, 4, 31, 23, 59, 59);
  const archive = document.querySelector("[data-calendar-archive]");

  if (!archive) {
    return;
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const rangeDateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const pad = (value) => String(value).padStart(2, "0");

  const toDate = (year, monthIndex, day) => new Date(year, monthIndex, day, 12);

  const toIsoDate = (date) => [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-");

  const addDays = (date, days) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  };

  const nthWeekdayOfMonth = (year, monthIndex, weekday, count) => {
    const firstDay = toDate(year, monthIndex, 1);
    const offset = (weekday - firstDay.getDay() + 7) % 7;
    return toDate(year, monthIndex, 1 + offset + (count - 1) * 7);
  };

  const firstWeekdayOfMonth = (year, monthIndex, weekday) => {
    return nthWeekdayOfMonth(year, monthIndex, weekday, 1);
  };

  const overlapsExcludedWindow = (event) => {
    const eventStartDate = event.startDate;
    const eventEndDate = event.endDate || event.startDate;

    return eventStartDate <= excludedEndDate && eventEndDate >= excludedStartDate;
  };

  const formatRange = (startDate, endDate) => {
    return [
      rangeDateFormatter.format(startDate),
      rangeDateFormatter.format(endDate),
      startDate.getFullYear(),
    ].join(" - ").replace(/ - (\d{4})$/, ", $1");
  };

  const annualEvents = (year) => {
    const littleInnDinner = firstWeekdayOfMonth(year, 5, 5);
    const lakeWeekStart = nthWeekdayOfMonth(year, 7, 1, 2);

    return [
      {
        title: "McLean Club Spring Golf Tournament",
        location: "Congressional Country Club",
        startDate: nthWeekdayOfMonth(year, 3, 0, 3),
      },
      {
        title: "Little Inn at Washington Dinner",
        startDate: littleInnDinner,
      },
      {
        title: "Brunch at Little Inn at Washington",
        startDate: addDays(littleInnDinner, 1),
      },
      {
        title: 'Fourth of July at "The Compound"',
        startDate: toDate(year, 6, 4),
      },
      {
        title: "McLean Club Summer Golf Tournament",
        location: "Washington Golf",
        startDate: nthWeekdayOfMonth(year, 6, 0, 3),
      },
      {
        title: "Lake Week",
        startDate: lakeWeekStart,
        endDate: addDays(lakeWeekStart, 6),
      },
      {
        title: "McLean Club Fall Golf Tournament",
        location: "Farmington CC",
        startDate: nthWeekdayOfMonth(year, 8, 0, 3),
      },
      {
        title: "Christmas Dinner",
        location: "L\u2019Auberge Chez Fran\u00e7ois",
        startDate: toDate(year, 11, 18),
      },
    ].sort((firstEvent, secondEvent) => firstEvent.startDate - secondEvent.startDate);
  };

  const appendEvent = (list, event) => {
    const item = document.createElement("li");
    const date = document.createElement("time");
    const details = document.createElement("span");
    const title = document.createElement("span");

    date.className = "event-date";
    date.dateTime = toIsoDate(event.startDate);
    date.textContent = event.endDate
      ? formatRange(event.startDate, event.endDate)
      : dateFormatter.format(event.startDate);

    title.className = "event-title";
    title.textContent = event.title;
    details.append(title);

    if (event.location) {
      const location = document.createElement("span");
      location.className = "event-location";
      location.textContent = event.location;
      details.append(location);
    }

    item.append(date, details);
    list.append(item);
  };

  archive.textContent = "";

  for (let year = endYear; year >= startYear; year -= 1) {
    const events = annualEvents(year).filter((event) => !overlapsExcludedWindow(event));

    if (events.length === 0) {
      continue;
    }

    const item = document.createElement("li");
    const heading = document.createElement("h3");
    const list = document.createElement("ol");

    item.className = "calendar-year";
    heading.textContent = year;
    list.className = "event-list";

    events.forEach((event) => appendEvent(list, event));

    item.append(heading, list);
    archive.append(item);
  }
})();
