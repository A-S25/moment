import Quote from "../_components/Quote"

type QuotePageProps = {
  searchParams: {
    quote?: string
    category?: string
  }
}

export default function QuotePage({ searchParams }: QuotePageProps) {
  const quote = searchParams.quote ?? ""
  const category = searchParams.category ?? "HAPPY"

  return <Quote quote={quote} category={category} />
}
