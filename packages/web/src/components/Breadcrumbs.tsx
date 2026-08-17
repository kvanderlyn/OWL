import {
      Breadcrumb,
      BreadcrumbItem,
      BreadcrumbList,
      BreadcrumbPage,
      BreadcrumbSeparator,
} from "@owl/lib/components/breadcrumb";
import { isMatch, Link, useMatches } from "@tanstack/react-router";
import { Fragment } from "react";
export function Breadcrumbs() {
      const matches = useMatches();
      const matchesWithCrumbs = matches.filter((match) => isMatch(match, "loaderData.crumb"));

      const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
            return {
                  href: pathname,
                  label: loaderData?.crumb,
            };
      });
      const itemLength = items.length;

      return (
            <Breadcrumb>
                  <BreadcrumbList>
                        {items.map((item, index) => {
                              if (itemLength - 1 === index) {
                                    return <BreadcrumbPage key={item.label}>{item.label}</BreadcrumbPage>;
                              }
                              return (
                                    <Fragment key={item.label}>
                                          <BreadcrumbItem>
                                                <Link to={item.href} className="breadcrumb-link">
                                                      {item.label}
                                                </Link>
                                          </BreadcrumbItem>
                                          <BreadcrumbSeparator />
                                    </Fragment>
                              );
                        })}
                  </BreadcrumbList>
            </Breadcrumb>
      );
}
