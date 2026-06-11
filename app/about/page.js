'use client';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './about.css';

const PixelPaintAnimation = dynamic(
  () => import('@/components/ui/pixel-paint-animation'),
  { ssr: false }
);

const TransparentImage = ({ src, alt, className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        // Replaces pixels close to white with `#09090b` (the background color)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          if (r > 240 && g > 240 && b > 240) {
            data[i] = 9;     // R
            data[i+1] = 9;   // G
            data[i+2] = 11;  // B
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (err) {
        console.error("Canvas pixel read error:", err);
      }
    };
  }, [src]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />;
};


export default function AboutPage() {
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  return (
    <div className="about-page">
      {/* Top Nav */}
      <nav className="about-nav">
        <Link href="/" className="about-nav-logo">Pixlate Studio</Link>
      </nav>

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <h1 className="about-title">PIXLATE</h1>
          <p className="about-subtitle">
            A generative art project combining algorithms and fine arts to create organic, visually captivating patterns.
          </p>
        </div>
      </section>

      {/* ── Pixel-Painting Interactive Animation ── */}
      <section className="about-animation-section">
        <div className="about-animation-label">
          <p className="about-animation-desc">
            Select a piece below, then click the canvas to watch it paint itself
          </p>
        </div>
        <PixelPaintAnimation />
      </section>

      {/* Intro Text */}
      <section className="about-section">
        <p className="about-body">
          I have been trained in fine arts, and I've always wanted to combine my love for art with coding.
          This project is my way of exploring that intersection. I've always loved the organic beauty of oil
          painting—the way countless shades blend seamlessly into one another, creating depth and emotion.
          With this project, I aimed to recreate that effect through code, letting algorithms mimic the natural
          flow of colors and patterns, blending art and technology into something truly unique. So, you might
          think, "I never knew art could be coded!" Well, during my semester break last summer, I came across
          this{' '}
          <a
            href="https://www.youtube.com/watch?v=w_59Tq_chHQ&t=71s"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            video
          </a>
          , which sparked the idea for this project. In addition, I read countless books on algorithmic/generative
          art and creative coding from my campus library which gave a boost to my learning.
        </p>
      </section>

      {/* What is Generative Art */}
      <section className="about-section">
        <h2 className="about-heading">What is Generative Art?</h2>
        <p className="about-body">
          Generative art is a form of art that is created using algorithms, where the artist sets up a system or
          a set of rules, and the final piece is produced by this system or process, sometimes with the help of
          randomness. This art is often autonomous, meaning the system or algorithm runs on its own to create the
          artwork without the direct involvement of the artist in each step. The key characteristic of generative
          art is that the artist is not creating every detail by hand; instead, they are designing a process that
          generates the artwork. The artist typically defines the initial conditions, constraints, and sometimes
          inputs, and then the algorithm creates the output, which can vary from piece to piece based on random
          elements or parameters set by the artist.
        </p>
      </section>

      {/* How does it work */}
      <section className="about-section">
        <div className="about-hero-gif" style={{ marginBottom: '24px' }}>
          <img src="/img/PIXLATE.gif" alt="Pixlate sorting visualization" />
        </div>
        <p className="about-body">
          The idea behind this process is to represent all possible colors within a color space, such as RGB, HSL,
          or others, in an organized and meaningful way. This is achieved by sorting and placing these colors on a
          canvas using algorithms. The placement of the colors is often based on certain mathematical principles,
          such as Euclidean distance in the chosen color space or the hue of the colors.
        </p>
      </section>

      {/* Technical Side */}
      <section className="about-section">
        <h2 className="about-heading">The Technical Side</h2>
        <p className="about-body" style={{ marginBottom: '1.5rem' }}>
          In the algorithm, a seed point is initially chosen, and the placement of colors begins from that point
          and spreads outward, much like how a seed grows. The algorithm ensures that similar colors are grouped
          closely together. For example, colors with similar hues, such as orange and yellow, will naturally cluster
          together in the arrangement. This creates visually coherent and aesthetically pleasing patterns, where
          colors that are perceived as similar by the human eye are positioned near each other. The result is a
          seamless transition between colors and an intuitive way of understanding the relationships between them
          within the given color space. A nearest neighbor search is often employed to optimize the placement of
          colors by identifying the closest match in a 3D color space, such as RGB. Data structures like K-D trees
          are used to accelerate this process, allowing for quick retrieval of the most similar colors during
          placement. This ensures that the algorithm remains efficient even as the canvas size grows significantly.
        </p>

        <p className="about-body" style={{ marginBottom: '1.25rem', marginTop: '1.5rem' }}>
          To showcase interactive creative coding, we can build custom stateful React components. For example, here is a React component that controls a canvas-based generative art crystal growth engine:
        </p>
        <div className="about-code-block" style={{ marginBottom: '2rem' }}>
          <div className="about-code-header">
            <span className="about-code-lang">jsx</span>
            <span className="about-code-label">GenerativeCanvas.jsx</span>
          </div>
          <pre className="about-code-pre">
            <code>
              <span className="code-keyword">const</span> <span className="code-name">GenerativeCanvas</span> = () =&gt; {"{\n"}
              {"  "}<span className="code-keyword">const</span> [pixels, setPixels] = <span className="code-name">React</span>.<span className="code-func">useState</span>(<span className="code-number">0</span>);{"\n"}
              {"  "}<span className="code-keyword">const</span> canvasRef = <span className="code-name">React</span>.<span className="code-func">useRef</span>(<span className="code-number">null</span>);{"\n\n"}
              {"  "}<span className="code-keyword">const</span> <span className="code-func">startGrowth</span> = () =&gt; {"{\n"}
              {"    "}<span className="code-keyword">const</span> ctx = canvasRef.current.<span className="code-func">getContext</span>(<span className="code-string">'2d'</span>);{"\n"}
              {"    "}<span className="code-func">growPattern</span>(ctx, setPixels);{"\n"}
              {"  };\n\n"}
              {"  "}<span className="code-keyword">return</span> ({"\n"}
              {"    "}&lt;<span className="code-tag">div</span> <span className="code-attr">className</span>=<span className="code-string">"p-4 border rounded-lg"</span>&gt;{"\n"}
              {"      "}&lt;<span className="code-tag">h2</span> <span className="code-attr">className</span>=<span className="code-string">"text-xl font-bold mb-4"</span>&gt;Crystal Growth Engine&lt;/<span className="code-tag">h2</span>&gt;{"\n"}
              {"      "}&lt;<span className="code-tag">p</span> <span className="code-attr">className</span>=<span className="code-string">"mb-2"</span>&gt;Active Pixels: {"{pixels}"}&lt;/<span className="code-tag">p</span>&gt;{"\n"}
              {"      "}&lt;<span className="code-tag">canvas</span> <span className="code-attr">ref</span>={"{"}canvasRef{"}"} <span className="code-attr">className</span>=<span className="code-string">"bg-black mb-4"</span> /&gt;{"\n"}
              {"      "}&lt;<span className="code-tag">button</span>{"\n"}
              {"        "}<span className="code-attr">onClick</span>={"{startGrowth}"}{"\n"}
              {"        "}<span className="code-attr">className</span>=<span className="code-string">"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"</span>{"\n"}
              {"      "}&gt;{"\n"}
              {"        "}Grow Canvas{"\n"}
              {"      "}&lt;/<span className="code-tag">button</span>&gt;{"\n"}
              {"    "}&lt;/<span className="code-tag">div</span>&gt;{"\n"}
              {"  "});{"\n"}
              {"};"}
            </code>
          </pre>
        </div>

        <p className="about-body" style={{ marginBottom: '1.25rem' }}>
          You can also run the core pixel sorting engine directly from your terminal using the compiled Go binary. Here is the CLI command structure to start the process:
        </p>
        <div className="about-code-block">
          <div className="about-code-header">
            <span className="about-code-lang">bash</span>
            <span className="about-code-label">CLI Commands</span>
          </div>
          <pre className="about-code-pre">
            <code>
              <span className="code-comment"># Run the engine with input, output, dimensions, and colorsort parameters:</span>{"\n"}
              ./pix.exe <span className="code-attr">-in</span> <span className="code-string">"input.jpg"</span> <span className="code-attr">-out</span> <span className="code-string">"output.png"</span> <span className="code-attr">-width</span> <span className="code-number">800</span> <span className="code-attr">-height</span> <span className="code-number">800</span> <span className="code-keyword">-colorsort</span>
            </code>
          </pre>
        </div>
      </section>

      {/* Monet Example */}
      <section className="about-section">
        <p className="about-body">
          For example, take this painting <strong>Water Lilies by Claude Monet</strong>.
        </p>
      </section>

      <section className="about-full-bleed">
        <img
          src="/img/Wallpaper-KH-Lily-Blue-2.jpg"
          alt="Water Lilies by Claude Monet"
          className="about-full-image"
        />
      </section>

      <section className="about-section">
        <p className="about-body">
          The colors that make up the painting can be arranged in different ways. My project involved an idea
          to do with "growing" artwork like a crystal: start by placing a seed color on a blank
          canvas, and then grow outwards pixel by pixel with like attracting like:
        </p>
      </section>

      {/* Progress thumbnails */}
      <section className="about-section">
        <div className="about-progress-grid">
          <TransparentImage src="/img/progress-center-1.png" alt="Progress step 1" className="about-progress-img" />
          <TransparentImage src="/img/progress-center-2.png" alt="Progress step 2" className="about-progress-img" />
          <TransparentImage src="/img/progress-center-3.jpg" alt="Progress step 3" className="about-progress-img" />
          <TransparentImage src="/img/progress-center-4.jpg" alt="Progress step 4" className="about-progress-img" />
        </div>
      </section>

      <section className="about-section">
        <p className="about-body">
          The colorful streaks are a result of the rules of the growth process and the order in which the colors
          are put down — similar colors tend to cluster together as they're being placed.
        </p>
      </section>

      {/* Full bleed result */}
      <section className="about-full-bleed">
        <img
          src="/img/progress-center-7.jpg"
          alt="Final pixlate result"
          className="about-full-image"
        />
      </section>

      <section className="about-section">
        <p className="about-body">
          You can apply this idea in different ways to make different pictures. Varying the position and number
          of seed colors gives rise to different spreading patterns, while varying the order in which colors are
          placed causes different kinds of streaking patterns to appear. You can also play with the forces that
          cause colors to attract each other to create a more painterly look.
        </p>
      </section>

      {/* Three variations gallery */}
      <section className="about-section">
        <div className="about-three-gallery">
          {[
            { file: 'variations-2', caption: 'As before, but with two seed points placed in opposite corners of the canvas.' },
            { file: 'variations-7_2', caption: 'Colors shuffled randomly and placed via average selection.' },
            { file: 'variations-4', caption: 'Seed points scattered across the canvas using poisson-disc sampling.' },
          ].map((item) => (
            <div key={item.file} className="about-gallery-piece">
              <img src={`/img/${item.file}.jpg`} alt={item.caption} className="about-variation-img" />
              <p className="about-gallery-caption">{item.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Complexity note */}
      <section className="about-section">
        <p className="about-body">
          In tasks like rendering, clustering, or color organization, a significant number of pixels need to be
          processed to determine relationships, groupings, or proximity. Performing these operations in a naive,
          brute-force manner—such as comparing every pixel with all others—results in a computational bottleneck
          due to the O(n²) complexity.
        </p>
      </section>

      {/* Spatial Search */}
      <section className="about-section">
        <h2 className="about-heading">Spatial Search</h2>
        <ul className="about-list">
          <li>
            <strong>Efficient Pixel Selection:</strong> Pixels on the canvas are not simply stored as an
            unstructured array but are organized in a data structure like a k-d tree, which partitions the
            pixel data based on spatial and color properties. This allows the algorithm to quickly find the
            closest matching pixel without iterating over the entire canvas.
          </li>
          <li>
            <strong>Color and Spatial Proximity:</strong> For every step of the artwork's growth, spatial search
            enables the algorithm to query pixels within a certain distance or matching certain color criteria.
          </li>
          <li>
            <strong>Incremental Growth with Local Coherence:</strong> As the artwork grows outward pixel by
            pixel, spatial search ensures that neighboring pixels are evaluated first, preserving the natural
            and organic look of the expanding pattern. This mimics the way crystals grow or oil paint blends,
            creating an aesthetically pleasing result.
          </li>
        </ul>
        <p className="about-body" style={{ marginTop: '1.5rem' }}>
          Using spatial search in this project enables the artwork to "grow" organically, with similar colors
          clustering naturally and patterns forming seamlessly. This approach not only enhances the visual quality
          of the generative art but also ensures computational efficiency, making it feasible to experiment with
          larger and more complex canvases.
        </p>
      </section>







      {/* Final Words */}
      <section className="about-section about-final">
        <h2 className="about-heading">Final Words</h2>
        <p className="about-body">
          This project is a journey into the intersection of art and technology, where algorithms and creativity
          work hand in hand. By leveraging the power of code, we've explored how mathematical precision can create
          intricate, organic, and visually compelling patterns. It's a reminder that art isn't confined to traditional
          mediums—it can emerge from logic, data, and computation.
        </p>
        <p className="about-body" style={{ marginTop: '1rem' }}>
          While this is just the beginning, the possibilities are limitless. With every experiment and iteration,
          we uncover new ways to blend art and science, continuing to blur the line between human expression and
          machine intelligence. Thank you for joining me on this exploration—I hope it inspires you to create,
          experiment, and imagine beyond boundaries.
        </p>
        <p className="about-signature">Arnab Jena &nbsp;·&nbsp; Dec 2024</p>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <Link href="/" className="about-footer-link">← Back to Pixlate Studio</Link>
      </footer>
    </div>
  );
}
