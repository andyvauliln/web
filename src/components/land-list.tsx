import { AccordionTrigger, AccordionContent, AccordionItem, Accordion } from "~/components/ui/accordion"

export default function LandList() {
    return (
        // <iframe width="100%" height="100%" src="https://e.notionhero.io/e1/p/c16fee3-884286f29d4a9f0076feaaf7ef7132a"></iframe>
        // <iframe src="https://duniakripto.notion.site/Business-Plan-v0-8-30e16e260d9045099e0d8ab739acdabd?pvs=4" width="100%" height="100%" />
        <Accordion className="w-full" collapsible type="single">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with default styles that matches the other components' aesthetic.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>Yes. It's animated by default, but you can disable it if you prefer.</AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
