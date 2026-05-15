import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { useAlgorithmStore } from "./store/algorithms";

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  useAlgorithmStore.setState({
    selectedId: "bubble-sort",
    inputArray: [5, 1, 4, 2],
    steps: [],
    currentStep: 0,
    isPlaying: false,
    speed: 400,
  });
});

afterEach(() => {
  cleanup();
  useAlgorithmStore.getState().pause();
});

describe("App flows", () => {
  it("starts sorting controls disabled until Run creates visualization steps", async () => {
    const user = userEvent.setup();
    render(<App />);

    const playButton = screen.getByRole("button", { name: "Play" }) as HTMLButtonElement;
    const nextButton = screen.getByRole("button", { name: "Next" }) as HTMLButtonElement;

    expect(screen.getByText("Ready to start")).toBeDefined();
    expect(playButton.disabled).toBe(true);
    expect(nextButton.disabled).toBe(true);

    await user.click(screen.getByRole("button", { name: "Run" }));

    expect(screen.getByText(/Step 1 \/ \d+/)).toBeDefined();
    expect(screen.getByRole("progressbar", { name: "Visualization progress" })).toBeDefined();
  });

  it("switches sorting algorithms and resets generated steps", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(/Step 1 \/ \d+/)).toBeDefined();

    await user.click(screen.getByRole("button", { name: /Quick Sort/ }));

    expect(screen.getByRole("button", { name: /Quick Sort/ }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("Ready to start")).toBeDefined();
    expect(screen.getByText(/Selects a pivot/)).toBeDefined();
  });

  it("validates BST input before running and runs for a valid value", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Trees" }));

    const input = screen.getByPlaceholderText("Enter a value (0-999)");
    const actionButton = screen.getByRole("button", { name: /^Insert$/ }) as HTMLButtonElement;

    await user.type(input, "abc");

    expect(screen.getByText("Enter an integer from 0 to 999.")).toBeDefined();
    expect(actionButton.disabled).toBe(true);
    expect(screen.queryByText(/Step 1 \/ \d+/)).toBeNull();

    await user.clear(input);
    await user.type(input, "65");
    expect(actionButton.disabled).toBe(false);

    await user.click(actionButton);

    expect(screen.getByText(/Step 1 \/ \d+/)).toBeDefined();
    expect(screen.getByText("Inserting value 65 into the BST.")).toBeDefined();
  });

  it("navigates between Trees and Sorting without breaking playback controls", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Trees" }));
    expect(screen.getByRole("button", { name: "Trees" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByPlaceholderText("Enter a value (0-999)")).toBeDefined();

    await user.click(screen.getByRole("button", { name: "Sorting" }));

    expect(screen.getByRole("button", { name: "Sorting" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Run" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Play" })).toBeDefined();
  });
});
