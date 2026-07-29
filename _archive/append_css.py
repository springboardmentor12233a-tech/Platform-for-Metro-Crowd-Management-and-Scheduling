css_to_append = """
/* Recovered Custom Classes */
.gradient-mesh-bg {
  z-index: 0;
  pointer-events: none;
  position: fixed;
  inset: 0;
  overflow: hidden;
}
.blob {
  filter: blur(80px);
  opacity: 0.5;
  border-radius: 50%;
  animation: 20s ease-in-out infinite alternate mesh-drift;
  position: absolute;
}
.btn-shimmer {
  background-image: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  background-size: 200%;
  transition: all 0.3s;
}
.btn-shimmer:hover {
  animation: 2s linear infinite shimmer;
}
.gradient-text {
  -webkit-text-fill-color: transparent;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981);
  -webkit-background-clip: text;
  background-clip: text;
}
.badge-gradient-emerald {
  color: #059669;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.dark .badge-gradient-emerald {
  color: #34d399;
}
.badge-gradient-red {
  color: #dc2626;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.dark .badge-gradient-red {
  color: #f87171;
}
.table-row-colorful:hover {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.05), transparent);
}
.dark .table-row-colorful:hover {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.03), rgba(6, 182, 212, 0.03), transparent);
}

@keyframes mesh-drift {
  0% { transform: translate(0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0) scale(1); }
}
@keyframes shimmer {
  0% { background-position: -200%; }
  100% { background-position: 200%; }
}
"""

with open(r'd:\Projects\Tejavardhan\AI_MetroFlow\frontend\src\index.css', 'a', encoding='utf-8') as f:
    f.write('\n' + css_to_append)
print("Successfully appended custom CSS to index.css")
