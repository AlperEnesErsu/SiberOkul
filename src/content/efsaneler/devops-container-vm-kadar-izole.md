---
iddia: "Container, sanal makine kadar izoledir."
hukum: yanlis
ozet: "Docker belgelerine göre bir container izole çalışan sıradan bir süreçtir ve makinedeki bütün container'lar aynı çekirdeği paylaşır. Sanal makine ise kendi çekirdeğini başlatır. Bu yüzden izolasyon farklı güçtedir."
analoji: "Apartman dairesi ile müstakil ev farkı: dairelerin kapısı ve duvarı var ama bina ortak; temeldeki bir çatlak herkesi etkiler."
kaynaklar:
  - { ad: "Docker Docs: What is a container?", url: "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/" }
  - { ad: "Docker Docs: Docker Engine security", url: "https://docs.docker.com/engine/security/" }
ilgiliDers: devops-008
tarih: "2026-11-25"
---

Docker'ın tanımına göre container, bilgisayarında izole çalışan sıradan bir süreçtir. Sanal makine kendi tam işletim sistemini ve çekirdeğini başlatırken, container'lar makinenin çekirdeğini paylaşır; boot edilecek ayrı bir işletim sistemi yoktur.

İzolasyonun dayanağı çekirdeğin namespace ve cgroup gibi özellikleridir. Docker'ın güvenlik sayfası da çekirdeğin bu özelliklerini ve güvenliğini inceleme alanlarından biri olarak sayar. Yani çekirdekteki bir açık, bütün container'ları ve host'u ilgilendirir.

Pratik sonuçlar:

- Container'ı gereksiz yetkiyle (ör. `--privileged`) çalıştırma.
- Docker soketini ya da host'un hassas klasörlerini container'a bağlama.
- Güvenilmeyen kodu çalıştıracaksan ek katman (sanal makine, gelişmiş sandbox) düşün.

Container yine de değerlidir: hafif, hızlı ve tekrarlanabilir. Yanlış olan "container içinde, güvende" varsayımıdır; izolasyon bir savunma katmanıdır, tek başına güvence değil.
