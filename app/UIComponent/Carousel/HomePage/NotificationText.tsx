export default function NotificationText({ contents }: any) {
  return (
    <div className="absolute z-[2] w-full  bottom-[-67px] contdown_container">
      <div className="coundown2 py-[30px] relative">
        <div className="absolute left-2 md:left-3 top-0 h-full z-10">
          <span className="news-burst news-flash">
            <span className="news-burst-text">BES ELECTION 2026-28</span>
          </span>
        </div>
        <div className="flex gap-1">
          <div className={"marquee w-full pl-[250px] md:pl-[420px]"}>
            <div className={"marqueeInner "}>
              {contents.map(({ text, href, target }: any, index) =>
                href ? (
                  <a
                    target={target ?? "_blank"}
                    href={href}
                    key={index}
                    className="cursor-pointer inline-block text-center"
                  >
                    <span>{text}</span>
                  </a>
                ) : (
                  <span className="inline-block text-center" key={index}>
                    {text}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
