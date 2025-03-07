import { test, expect } from "vitest";
import { evaluateFilter, evaluateFilterGroup } from "../src/filter";
import { EventData } from "../src/transformCalendar";

const simpleEvent: EventData = {
  organizerNames: [ 'john doe' ],
  organizerEmails: [ 'john.doe@example.com' ],
  uid: 'uid1@example.com',
  text: 'Bastille Day Party',
  location: "France",
  priority: 5
}

test("no filters group - any", () => {
  expect(evaluateFilterGroup({
    filters: [],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("no filters group - all", () => {
  expect(evaluateFilterGroup({
    filters: [],
    all: true,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("no filters group - not any", () => {
  expect(evaluateFilterGroup({
    filters: [],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("no filters group - not all", () => {
  expect(evaluateFilterGroup({
    filters: [],
    all: true,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("filter organizer", () => {
  expect(evaluateFilter({
    type: "organizer",
    value: "john doe"
  }, simpleEvent)).toBe(true);
});

test("filter email", () => {
  expect(evaluateFilter({
    type: "email",
    value: "john.doe@example.com"
  }, simpleEvent)).toBe(true);
});

test("filter uid", () => {
  expect(evaluateFilter({
    type: "uid",
    value: "uid1@example.com"
  }, simpleEvent)).toBe(true);
});

test("filter text", () => {
  expect(evaluateFilter({
    type: "text",
    value: "Bastille"
  }, simpleEvent)).toBe(true);
});

test("filter location", () => {
  expect(evaluateFilter({
    type: "location",
    value: "France"
  }, simpleEvent)).toBe(true);
});

test("filter priority", () => {
  expect(evaluateFilter({
    type: "priority",
    value: 5
  }, simpleEvent)).toBe(true);
});

test("filter wrong organizer", () => {
  expect(evaluateFilter({
    type: "organizer",
    value: "jane doe"
  }, simpleEvent)).toBe(false);
});

test("filter wrong email", () => {
  expect(evaluateFilter({
    type: "email",
    value: "jane.doe@example.com"
  }, simpleEvent)).toBe(false);
});

test("filter wrong uid", () => {
  expect(evaluateFilter({
    type: "uid",
    value: "uid2@example.com"
  }, simpleEvent)).toBe(false);
});

test("filter wrong text", () => {
  expect(evaluateFilter({
    type: "text",
    value: "Bananas"
  }, simpleEvent)).toBe(false);
});

test("filter wrong location", () => {
  expect(evaluateFilter({
    type: "location",
    value: "Jupiter"
  }, simpleEvent)).toBe(false);
});

test("filter wrong priority", () => {
  expect(evaluateFilter({
    type: "priority",
    value: 8
  }, simpleEvent)).toBe(false);
});

test("single filter group - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("single wrong filter group - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe"
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("single filter group - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("single wrong filter group - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe"
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("single filter group - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("single wrong filter group - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe"
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(true);
});

test("single filter group - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("single wrong filter group - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe"
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(true);
});

test("two filter group - one succeeds - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "organizer",
      value: "jane doe"
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - one succeeds - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "organizer",
      value: "jane doe"
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("two filter group - one succeeds - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "organizer",
      value: "jane doe"
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - one succeeds - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "organizer",
      value: "jane doe"
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(true);
});

test("two filter group - both succeed - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "email",
      value: "john.doe@example.com"
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - both succeed - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "email",
      value: "john.doe@example.com"
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - both succeed - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "email",
      value: "john.doe@example.com"
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - both succeed - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "email",
      value: "john.doe@example.com"
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("single inverted filter group - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe",
      invert: true
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("single inverted wrong filter group - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe",
      invert: true
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("single inverted filter group - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe",
      invert: true
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("single inverted wrong filter group - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe",
      invert: true
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("single inverted filter group - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe",
      invert: true
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(true);
});

test("single inverted wrong filter group - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe",
      invert: true
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("single inverted filter group - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe",
      invert: true
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(true);
});

test("single inverted wrong filter group - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe",
      invert: true
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - one succeeds, inverted fails - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "organizer",
      value: "john doe",
      invert: true
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - one succeeds, inverted fails - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "organizer",
      value: "john doe",
      invert: true
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("two filter group - one succeeds, inverted fails - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "organizer",
      value: "john doe",
      invert: true
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - one succeeds, inverted fails - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "organizer",
      value: "john doe",
      invert: true
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(true);
});

test("two filter group - one succeeds inverted - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe"
    },
    {
      type: "organizer",
      value: "jane doe",
      invert: true
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - one succeeds inverted - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe"
    },
    {
      type: "organizer",
      value: "jane doe",
      invert: true
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("two filter group - one succeeds inverted - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe"
    },
    {
      type: "organizer",
      value: "jane doe",
      invert: true
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - one succeeds inverted - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe"
    },
    {
      type: "organizer",
      value: "jane doe",
      invert: true
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(true);
});

test("two filter group - both succeed, one inverted - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "email",
      value: "jane.doe@example.com",
      invert: true
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - both succeed, one inverted - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "email",
      value: "jane.doe@example.com",
      invert: true
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - both succeed, one inverted - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "email",
      value: "jane.doe@example.com",
      invert: true
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - both succeed, one inverted - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe"
    },
    {
      type: "email",
      value: "jane.doe@example.com",
      invert: true
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - both succeed, inverted - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe",
      invert: true
    },
    {
      type: "email",
      value: "jane.doe@example.com",
      invert: true
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - both succeed, inverted - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe",
      invert: true
    },
    {
      type: "email",
      value: "jane.doe@example.com",
      invert: true
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(true);
});

test("two filter group - both succeed, inverted - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe",
      invert: true
    },
    {
      type: "email",
      value: "jane.doe@example.com",
      invert: true
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - both succeed, inverted - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "jane doe",
      invert: true
    },
    {
      type: "email",
      value: "jane.doe@example.com",
      invert: true
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(false);
});

test("two filter group - both fail, inverted - any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe",
      invert: true
    },
    {
      type: "email",
      value: "john.doe@example.com",
      invert: true
    }],
    all: false,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("two filter group - both fail, inverted - all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe",
      invert: true
    },
    {
      type: "email",
      value: "john.doe@example.com",
      invert: true
    }],
    all: true,
    invert: false
  })(simpleEvent)).toBe(false);
});

test("two filter group - both fail, inverted - not any", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe",
      invert: true
    },
    {
      type: "email",
      value: "john.doe@example.com",
      invert: true
    }],
    all: false,
    invert: true
  })(simpleEvent)).toBe(true);
});

test("two filter group - both fail, inverted - not all", () => {
  expect(evaluateFilterGroup({
    filters: [{
      type: "organizer",
      value: "john doe",
      invert: true
    },
    {
      type: "email",
      value: "john.doe@example.com",
      invert: true
    }],
    all: true,
    invert: true
  })(simpleEvent)).toBe(true);
});