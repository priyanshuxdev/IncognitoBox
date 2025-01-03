import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
// import AutoScroll from "embla-carousel-auto-scroll";
import messages from "@/data/message.json";

export default function CarouselComp() {
  return (
    <>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="bg-[#0A0A0A] text-yellow-50">
                  <CardContent className="flex flex-col gap-4 aspect-auto items-center justify-center p-6">
                    <span className="text-sm textGradient">
                      {message.title}
                    </span>
                    <p className="font-bold text-center">{message.content}</p>
                    <span className="text-sm textGradient">
                      {message.received}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}
