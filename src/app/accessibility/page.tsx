import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Eye, Keyboard, Monitor, Palette, Ear } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans">
      <Header />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Game
        </Link>

        <h1 className="text-3xl font-bold mb-2">Accessibility Statement</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: June 26, 2026</p>

        <div className="space-y-6 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">Our Commitment</h2>
            <p className="mb-2">
              Techdle is committed to ensuring digital accessibility for all users, including individuals with
              disabilities. We continually improve the user experience for everyone and apply relevant accessibility
              standards to ensure the Game is perceivable, operable, understandable, and robust.
            </p>
            <p>
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, which defines
              requirements for designers and developers to improve accessibility for people with disabilities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Visual Accessibility
            </h2>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li><strong className="text-text-muted">High-Contrast Mode</strong> — Available in Settings (accessible from the gear icon). This increases color contrast across all game elements for users with low vision or color vision deficiencies.</li>
              <li><strong className="text-text-muted">Theme Options</strong> — Light and dark themes are available to suit different lighting conditions and visual preferences.</li>
              <li><strong className="text-text-muted">Color Independence</strong> — The Game does not rely solely on color to convey information. Guesses and clues are distinguishable by position, text, and icons in addition to color cues.</li>
              <li><strong className="text-text-muted">Readable Typography</strong> — We use the Geist font family with adequate font sizes and generous line spacing for comfortable reading.</li>
              <li><strong className="text-text-muted">Sufficient Contrast Ratios</strong> — All text and interactive elements maintain contrast ratios that meet or exceed WCAG AA requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-primary" /> Keyboard Navigation
            </h2>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>The Game is fully operable via keyboard. All interactive elements — buttons, links, form fields, and game tiles — are reachable using the Tab key.</li>
              <li>Focus indicators are visible on all interactive elements to show which element is currently active.</li>
              <li>Game input can be typed directly without requiring mouse interaction.</li>
              <li>Enter and Space keys activate buttons and links throughout the interface.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" /> Screen Reader Support
            </h2>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>The Game uses semantic HTML elements (<code className="text-primary">&lt;button&gt;</code>, <code className="text-primary">&lt;nav&gt;</code>, <code className="text-primary">&lt;main&gt;</code>, headings) to provide meaningful structure for assistive technologies.</li>
              <li>Interactive elements have accessible names and roles where necessary.</li>
              <li>Game state changes (correct guesses, new clues, win/loss) are communicated to assistive technologies via appropriate ARIA live regions.</li>
              <li>Images and icons include descriptive alt text or are marked as decorative when appropriate.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" /> Color Blindness Considerations
            </h2>
            <p>
              We understand that color vision deficiencies affect a significant portion of our users. The Game&apos;s
              color palette is chosen to be distinguishable by users with protanopia, deuteranopia, and tritanopia.
              Additionally, the high-contrast mode setting provides even more distinct visual cues for users with
              color vision deficiencies. Information is never conveyed through color alone.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2 flex items-center gap-2">
              <Ear className="w-4 h-4 text-primary" /> Auditory Accessibility
            </h2>
            <p>
              The Game does not rely on sound for any functionality. All game information is conveyed visually
              and through text, making it fully accessible to users who are deaf or hard of hearing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">Known Limitations</h2>
            <p className="mb-2">
              While we strive for full accessibility, we acknowledge the following areas are being improved:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>Some older screen readers may not fully interpret ARIA live region announcements.</li>
              <li>The puzzle timer may not be perceivable by screen readers in all browsers — we are working on a text-based alternative.</li>
              <li>Gesture-based navigation on mobile devices may be challenging for users with motor impairments. Keyboard support is recommended in these cases.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">Feedback &amp; Support</h2>
            <p className="mb-2">
              We welcome your feedback on the accessibility of Techdle. If you encounter any accessibility barriers
              or have suggestions for improvement, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li><strong className="text-text-muted">Email:</strong> <span className="text-primary">techdle.game@gmail.com</span></li>
            </ul>
            <p className="mt-2">
              We aim to respond to accessibility-related inquiries within 5 business days and will make every
              effort to address reported issues promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">Compliance Status</h2>
            <p>
              Techdle is partially conformant with WCAG 2.1 Level AA. Partial conformance means that some parts
              of the Game may not fully conform to the accessibility standard. We are actively working to address
              these areas and welcome user reports to help us improve.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
