"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { navigation } from "@/config/navigation.config"
import { cn } from "@/lib/utils"
import { usePermission } from "@/hooks/use-permission"

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function SidebarNavigation() {
  const pathname = usePathname()
  const { has } = usePermission()

  return (
    <SidebarContent>
      {navigation.map((group) => {
        const visibleItems = group.items.filter(
          (item) => !item.permission || has(item.permission)
        )

        if (visibleItems.length === 0) {
          return null
        }

        return (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {visibleItems.map((item, itemIndex) => {
                  const Icon = item.icon
                  const itemKey = item.href ?? `${item.title}-${itemIndex}`

                  const visibleChildren = item.children?.filter(
                    (child) => !child.permission || has(child.permission)
                  )

                  const hasChildren = Boolean(visibleChildren?.length)

                  const isChildActive =
                    visibleChildren?.some(
                      (child) => Boolean(child.href) && pathname === child.href
                    ) ?? false

                  const isActive = Boolean(item.href) && pathname === item.href

                  if (hasChildren) {
                    return (
                      <Collapsible
                        key={itemKey}
                        asChild
                        defaultOpen={isChildActive || isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isActive}
                              tooltip={item.title}
                              className="px-3 py-4.5"
                            >
                              {Icon && (
                                <Icon
                                  className={cn(
                                    (isActive || isChildActive) &&
                                    "text-primary",
                                    "size-4.5!"
                                  )}
                                />
                              )}

                              <span>{item.title}</span>

                              <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {visibleChildren?.map((child, childIndex) => {
                                const ChildIcon = child.icon
                                const childKey =
                                  child.href ?? `${child.title}-${childIndex}`

                                const isChildItemActive =
                                  Boolean(child.href) && pathname === child.href

                                return (
                                  <SidebarMenuSubItem key={childKey}>
                                    <SidebarMenuSubButton
                                      asChild={Boolean(child.href)}
                                      isActive={isChildItemActive}
                                    >
                                      {child.href ? (
                                        <Link href={child.href}>
                                          {ChildIcon && (
                                            <ChildIcon
                                              className={cn(
                                                isChildItemActive &&
                                                "text-primary",
                                                "size-4"
                                              )}
                                            />
                                          )}
                                          <span>{child.title}</span>
                                        </Link>
                                      ) : (
                                        <span>
                                          {ChildIcon && (
                                            <ChildIcon className="size-4" />
                                          )}
                                          <span>{child.title}</span>
                                        </span>
                                      )}
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  }

                  return (
                    <SidebarMenuItem key={itemKey}>
                      {item.href ? (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className="px-3 py-4.5"
                        >
                          <Link href={item.href}>
                            {Icon && (
                              <Icon
                                className={cn(
                                  isActive && "text-primary",
                                  "size-4.5!"
                                )}
                              />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          tooltip={item.title}
                          className="px-3 py-4.5"
                        >
                          {Icon && <Icon className="size-4.5!" />}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      })}
    </SidebarContent>
  )
}
