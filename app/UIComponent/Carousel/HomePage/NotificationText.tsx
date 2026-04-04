type NotificationItem = {
  text: string;
  href?: string;
  target?: string;
};

type NotificationTextProps = {
  contents: NotificationItem[];
  notificationText?: string;
};

export default function NotificationText({
  contents,
  notificationText,
}: NotificationTextProps) {
  return (
    <div className="absolute z-[2] w-full  bottom-[-67px] contdown_container">
      <div className="coundown2 py-[30px] relative">
        {!!notificationText && (
          <div className="absolute left-2 md:left-3 top-0 h-full z-10">
            <span className="news-burst news-flash">
              <span className="news-burst-text"> {notificationText}</span>
            </span>
          </div>
        )}
        <div className="flex gap-1">
          <div className={"marquee w-full pl-[250px] md:pl-[420px]"}>
            <div className={"marqueeInner "}>
              {contents.map(({ text, href, target }, index) =>
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
