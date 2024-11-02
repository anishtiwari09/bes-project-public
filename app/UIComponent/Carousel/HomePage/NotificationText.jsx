export default function NotificationText({ contents }) {
  return (
    <div className="absolute z-[2] w-full  bottom-[-67px] contdown_container">
      <div className="coundown2  py-[30px]">
        <div className="flex gap-1">
          <div className={"marquee w-full"}>
            <div className={"marqueeInner "}>
              {contents.map(({ text, href, target }) =>
                href ? (
                  <a
                    target={target ?? "_blank"}
                    href={href}
                    className="cursor-pointer block text-center"
                  >
                    <span>{text}</span>
                  </a>
                ) : (
                  <span className="block text-center">{text}</span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
