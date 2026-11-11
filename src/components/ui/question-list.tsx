/** A short list of the questions a view exists to answer. */
export function QuestionList({ questions }: { questions: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {questions.map((question) => (
        <li key={question} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-[0.55em] size-1 shrink-0 bg-graphite-500"
          />
          <span>{question}</span>
        </li>
      ))}
    </ul>
  );
}
