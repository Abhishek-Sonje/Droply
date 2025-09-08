import { Card, CardBody, CardFooter, Image } from '@heroui/react';
import React from 'react'
function file({}) {
    return (
      <Card
        key={}
        isPressable
        shadow="sm"
        onPress={() => console.log("item pressed")}
      >
        <CardBody className="overflow-visible p-0">
          <Image
            alt={item.title}
            className="w-full object-cover h-[140px]"
            radius="lg"
            shadow="sm"
            src={item.img}
            width="100%"
          />
        </CardBody>
        <CardFooter className="text-small justify-between">
          <b>{item.title}</b>
          <p className="text-default-500">{item.price}</p>
        </CardFooter>
      </Card>
    );
}

export default file;