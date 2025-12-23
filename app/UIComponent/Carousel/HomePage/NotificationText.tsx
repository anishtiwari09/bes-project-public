export default function NotificationText({ contents }: any) {
  return (
    <div className="absolute z-[2] w-full  bottom-[-67px] contdown_container">
      <div className="coundown2  py-[30px]">
        <div className="flex gap-1">
          <div className={"marquee w-full"}>
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
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
