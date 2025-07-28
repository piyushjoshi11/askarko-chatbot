// app/page.tsx
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <main>
      <Logo />
      <h1>Welcome to my app!</h1>
    </main>
  )
}

// app/learn/page.tsx
import { PageHeader } from "@/components/page-header"

export function Learn() {
  return (
    <main>
      <PageHeader title="Learn" />
      <p>Learn about our platform.</p>
    </main>
  )
}

// app/explore/page.tsx

export function Explore() {
  return (
    <main>
      <PageHeader title="Explore" />
      <p>Explore the possibilities.</p>
    </main>
  )
}

// app/business-development/page.tsx

export function BusinessDevelopment() {
  return (
    <main>
      <Logo />
      <h1>Business Development</h1>
      <p>Contact us for business opportunities.</p>
    </main>
  )
}

// app/onboard/page.tsx

export function Onboard() {
  return (
    <main>
      <PageHeader title="Onboard" />
      <p>Get started with our platform.</p>
    </main>
  )
}
