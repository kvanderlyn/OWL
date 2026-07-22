import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@owl/lib/components/breadcrumb";
import { isMatch, Link, useMatches } from "@tanstack/react-router";

export function Breadcrumbs() {
    const matches = useMatches()
    const matchesWithCrumbs = matches.filter((match) => isMatch(match, 'loaderData.crumb'));

    const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
        return {
            href: pathname,
            label: loaderData?.crumb
        }
    })
    const itemLength = items.length

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => {
                    if (itemLength - 1 === index) {
                        return (
                            <BreadcrumbPage key={index}>
                                {item.label}
                            </BreadcrumbPage>
                        )
                    }
                    return (
                        <BreadcrumbItem key={index}>
                            <Link to={item.href} className="breadcrumb-link">
                                {item.label}
                            </Link>
                            <BreadcrumbSeparator />
                        </BreadcrumbItem>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}