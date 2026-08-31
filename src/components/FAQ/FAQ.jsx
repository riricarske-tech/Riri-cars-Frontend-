import { MdExpandMore } from 'react-icons/md'
import { faqs } from '../../data/faqs'

export default function FAQ() {
  return (
    <section id="faq" className="section-gap bg-white" aria-labelledby="faq-heading">
      <div className="container-main max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-primary font-bold text-xs uppercase tracking-widest">
            Common Questions
          </span>
          <h2 id="faq-heading" className="section-title mt-1 mx-auto">
            Frequently Asked Questions
          </h2>
          <div className="divider-red mx-auto" />
          <p className="text-muted mt-3">
            Everything you need to know about buying new or used cars in Nairobi.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group bg-brand-bg border border-brand-border rounded open:border-primary/40 open:shadow-card transition-all"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-bold text-dark text-sm sm:text-base [&::-webkit-details-marker]:hidden">
                {question}
                <MdExpandMore
                  className="text-primary text-xl flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-5 text-muted text-sm leading-relaxed">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
