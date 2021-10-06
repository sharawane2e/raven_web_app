import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import pptxgen from "pptxgenjs";
import {
  singleChartDataGen,
  gridChartDataGen,
  tableChartDataGen,
} from "../../utils/PptDataGenerator";
import { QuestionType } from "../../enums/QuestionType";
import { ISlideConfig } from "../../types/ISlideConfig";
import { colorArr, primaryBarColor } from "../../constants/Variables";
import * as path from "path";

interface ExportChartProps {}

const setDefaultSlideProperties = (
  slide: any,
  pptxGenJsObj: any,
  config: ISlideConfig
) => {
  const { mainQuestionText, chartFontFace, baseText, questionText } = config;

  slide.addShape(pptxGenJsObj.ShapeType.rect, {
    x: 0.4,
    y: 0,
    w: 0.1,
    h: 0.5,
    fill: { color: primaryBarColor },
    line: { type: "none" },
  });
  slide.addText(mainQuestionText, {
    x: .5,
    y: 0.25,
    w: 8,
    fontFace: chartFontFace,
    fontSize: 12,
    color: "323c4e",
    align: "left",
    bold: true,
  });
  slide.addText(baseText, {
    x: 0.3,
    y: 4.75,
    w: 9.5,
    fontFace: chartFontFace,
    fontSize: 8,
    color: "404040",
    align: "left",
    bold: true,
  });
  slide.addText(questionText, {
    x: 0.3,
    y: 4.9,
    w: 9.5,
    fontFace: chartFontFace,
    fontSize: 8,
    color: "404040",
    align: "left",
  });
  slide.addImage({ 
    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAC+CAYAAAG0Zc2iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADasSURBVHhe7Z0JuCxVde+vcTZxNtPTF2M0aoiJxmvI5ZxdfRQwksE8NFx9xikGxSiiQUO4p3f1a0URx6hRMQ5BxYmHOETUGCQqAlHEAYwIiEEEFZDhnq7uc0GQe7JW9aq6VbtXdQ1d3V19zv/3ff9zuvZee+1du/ZQ1V21a1sZ+tb7at/3AtLxErR5oZ28iLSRJzHfPGg7mSdJurhoO1VG4mbx0HamisTdYqHtSFWJy8VA24FJJa6bTeB752uFn1TivtloBa9F1jtHsmguqQKvHvirybDhZ7MWfU6StGGi7aQkKmZc3LRR80wWaK3t7b+xc+fto22J57O66HNsmxWWFMcnicIC631Hi58mI/lRwFc4MNKsdp6JPveteZ1rH23HNjnbTLQd+OZNye3IJrkdhtGfcMci8c6zYZLIRjZDkmkkaMR5Mi5Ci9M+u2E0KH8++hwGJshKIx9jRuK5lvhDpLJHPiktnsOSJO3CAII/c56ROKy366D7hj5o0Az/+63fS8ZzWGDNrdHn5H8m+TlCjecPkao0+6C9/CT+z2jxSaKwje72u0WfY3sabKMwOtJfpJ17c9Jmo7vtF5Lb0X83jNHC3fj4w4R6lxIWKsygAIP20qMG1nu2bG5b6648ZOAvP0s2Q2iQ3CUfQ6hy2vIxE5qpjpaPOlqh65C4bz5a4SeVuG4+WuEnkbhdHLSdqCpxuVhoO1JW4mox0XaoqMTFYqPt2Fh1Wo+TpJsHdUcTErPNTeAvH0s7y2d6F63tMveW4M1J8uiOk5gvPtrO5annmz+X5IuJtlNlJG4WC21HqkjcLQbaDlQVXXq+Udw2G7okvEDbgUkkrpuNVvA6JO6bi1boOiTum4lW2Kxt/hzhhlG/fm4U5sZFjIubNpznjccefE/ZTBcmKlDWthbHaHFDmRNCAyGyY5KfZwHnd90xS3eXzdHCumHJbS2OSYa5EpOQ5Lb7OWk/sm29p0fbG92VO6g2YVz6S8tI0ZesyfCUQRigoMVFYT1/6WESNOKLJVEhWhz/X7NLD44+J/9HJLez4vh/9Dmw5nmaXdI2DnAjtG03LqmsOA6PiLaDjlmOPkf/k9+vM8n0/D+Kj2zC+O4Bv5K0CdreX8Zx1vtv/hzBYVFTD9OERglFEdq2Fsf0rdkZ/k/EhZIfLyNSaZTP4/6zNrr73Sn8LE3ftQn81pP5M8Pb6x2znY7+VdH22B2vJOu9UwvnTIoy8r26763KxxA+utyEZXMb75R8zITKdaR81NEKXYfEfXPRCj25zDPEfbPRC19d4rb5aIWvKnG5OGg7UVbiavHQdqaoxMVio+3YOEmyzYO2k0mJ2dZEq5AiClbNfuICNBk6N/m0dgDrkmQD5g0djEIPgdQtyR7MEu1AzENSHDBN6OL/DK3y5y0pHqgbrbKbJCkmqAutkpsoKS6YFK1ymywpNqiKVqmLICk+qIJWoZGiB5z4dzwtPnRA0Ofw0Rc3XKOKnSYxy0RLEynomCPEbNMR7WPqVoEkfb/1kmRluJr0oCfDXInJWJs8iQuVLJtxafvWvJvigsA3XQlKwY8ZBb53Rd96lwTdlftJcArycRz76PvmPRI0AsWdJvmEjxsm6a+uPCJYXXm4bG7j34gHfutPZTOE7zgInwG15gf8kJsEh0T7F/92PHxEMuh3vBeJgRlERpq0Rxk1yDbroJ8Uy3r/EsVHErMYNz5PkkxFs6HL0Vu1cDeM6uX/joaNbsvHEDee72txw+ggH5bepgbk2ETbdFC/Hn2m8vxzMo4VGhP0OXz2VjZTNqz1TusP5cAP09HGZUkDV3FPT+xAUmEuBH3OOOjmvFjDtWxS6ZOiCjlUklF+w5t98iTmKpo9y70nX7NJSsxG7CQ4xI1zNeh4TxDTTFuJjuO5gUpQyD5bc64EqUR2g/byn0hQSBS+jYeoaEPTNIf3UNZ82Q2TpPlpffNpMVWJ7GQzJJH+RAlK5SNBhUimoQZ7ZZ4P6tUnazZuWLSdvPWH6XVaB7i2GpGNO6en0kYbmqZ60K13g5iNoNo7EtNMsuyyfCTDk+K49e7KA7S46G6+CM2GJdFj90tMYhv3oEck0yQl0XH82IMe3Z23aAoLD6qjVWqTJcUGk6JVbhMlxQV1wdenWkU3RVJMMA20Cp+npFhgFmgHYJaio307KQqYNXQ9/V3toExLki1oCnwXq3agJlGwKA9vgzT8hb52QFOy3tvFHGwWetZbCqz3EdIP6SAHNC1cF1jzmV57+YliAhYdOrCvTfXkorLmy+ICLAJ7jzrkzuqBrKiBNYeIa9BEtINWl/hXJMkGNAHtIE1LkiWYJ9qBmbYkazAPtAMyM1nvQCkGmBXqgZixAt+8XooDpo12AOYmWbkITBG14ucsKRqYBlqFN0VSRFAngfUO1yq7KQp8b48UFdSFVtFNkxQV1AFdHv23VslNlBQZTIpWuU2VFBlMAl8La5XbZEnRQVW0Sm26pOigKlqlNl28BLQUH5Ql75EmMctsGBKdipcglaRdKGteLVExIzaanEXMXdQ0JLosPVNMNi3RvsrmKMkK0SRmmXYSnYqXIJUqdlkSUxWKTz1Q6UrMNiW5+5isCE1ilmkn0al4CeLLwNOT4a7ELJWWXybLqz0kw7IkyVUoPjzogazqH5FIf7wEbTqifZTNURKVoErMMu0kOhUvQXyv/MeS4SlZ8wMxyy1DliS5CsUPD7rv/UiCQmj7W1np19s77s/TBk0BF0jQCBTPb2/gGz5fJ0EpePEGamjf7Pvm8tR7cRLwTaK8/+TnIl58QYJjeOmRvr/8u7IZPtcuH2Mo7C1cDrryOkWCYtz9o7y+R2X6mmzmV7iYZdpJdCpegsYfdJKY8Q58XovPkyRXofiMg26u0dJHYa4kOnPxBokO0eJZEr1tjz3ggVo8S0xCojAe9dx4akwXR2EpWXOdmMTpad/3pmxY/E6VkUBH4icXLQ31iiNpe9+aM773U46PxMO4mIZQD/vHZHyeJJkKxctBN1dKUIiWNgqj8saLJERhV7/s8b+Y3I78ke2BvM2fmSheC+P9kqBhmDUHy2ZsI5shUVgk6qU3heHD+hyGW+81HEYjy114mz9HxDZDu9Ojt/pEGsnAlfjJpUiacN2ZhF2WPVXSzzQ7V2KuQvGZJ3J04G4Ws5AoXDZjkuHR52SPSpK0TZIVHkH7ehvHU6/8sATty8tJty9839CvoaVl4vDoQ5bEPtNOolPxEsQt8zXDAx1r7EpWkixEi3clpioUn3nQxSSEl+PSbJISU6dM5jwJDknHjUrM+CDv0uJ5KhST2JdsxmSFu+Smjz5kSewz7SQ6FS9BuXO6JknK/t7lxrkSUxWKH5nTo3QUFr/2aq1rfisK53V1XO09esddxTSEDvblkT1LgmPfmo+NI7bfMWkzlDk6DLNmd7i9VQ56aKOEMTSP/X83zpWYqlD8yEHX1nVjtLA8ojQ0VXwwuR1GZqDZRGFlDjqNoB+VoBgyjh/pzku/z1GGxD7TTqJT8RI0/qBTCxezENqRl8vHEDWNIzFVofiRg85EaSn8WxLk5NV6ioSdyNuhARHHr648IrUd91ivF4VRQwhXm6Q8OmEYnUiFNk4ait931VLgoPOTQFFctF+Dtvdo197djojDKbNXRxuaxD5R4Px4CSrU0zUortDrQ8RcheLVg85o6aMwV9GSalocK0wsaPGs6OydfblxcViBg85Qgzolik9J+d5DNmNS4dHGvERD+edIbyAVfqNEHQv6Xttd+SX5GEMH6PDAXz6W53oJStHzvb/meH6eT4JGoF7/dGpsq4P20qMkKAWvx8v5yGYleDVIqq921lpzuWiV2nRJ0UFVqMVcpVVskyVFB5OgVWxTtdbdcR8pNpgErXKbKikyqAOtgpum5OL3oAa0Sm6apKigTrSKboqkiGAaaBU+bw2seaYUD0yDwHq+VvHzlBQNTBP316R5SooEZkFgzbe1gzBLSVHALOHvmrWDMW3RFHObFAHMC+3ATEu7rfcgyRbMm1l8Ry9ZgaahHaxJJa5B0+HfhLUDWEKniiuwiPDTHDT8f005sLGokVw78JcfKUkAGDK8I8Q7U2s01WUu71vz0uiuVADAjKCOF7/Zec76uPt0FQCgItSxZ/qCr0mE90wAUBA6/daf0lsw0X78WHYJAMAMrPfHWmfZPDJnya4CsPWgWS9cSGEraeC3/kB2H4DNjdYBtpyseYdUBwCbC7XBb3EFvjlUqgeAxUZr4FBavKKkVBcAi0XQMS/UGjWULak6ABYDXj1Va8hQvnAnHlgItMYLlVPQXn6SVCcAzUNrtFBFJZb9BKAxqI0VmkiB9d4v1QvA/NEaKVSP+H1LUs0AzI/Amlu1BgrVJ6lqAOYDnVo2boHAzSqpcgBmj9Ygt5r4STU6q3kzvw5mYL2/D3zvZApb12wn1IlS7QDMjr71PqE0xkKKXlgVwe8X1OyyJMliKKzQyzHLoPmKJCaFobq6RPNTVuKuEpQ+s47GiQcvcQEWDPdYXnfM0t0lqjiukzKaZ0fnlWE4/3Faby89RvPVb5sXi5sU/G4Qmsk7pOcGq+aXJThG9VVBvfbyDnFZGkqfqiP5buWifvgi9Ujp/JISN2CBcI9h6Y6efC9nFXFnElchs+zo/Pu0ZpcnfqxWXMRQ2Hc020jU8fdSh7pai6siyu8Cybo0lD7d0ZXXiCZJ2kaSKLAguMevdEenzvJe10kZLWRHp04rLmKq+ppEknVpKG25jq5cmkmUSq9j/si1H5H1zhHzTNR0jtZ2mXuLuQrZ3OimcSWmmQS++YaWLiVr+mKu4tpzO+fwoOP9bTKc8npTmMCh8KIszovEI1y767v73yMMz7ns7llvKXRAjeQKzaCoFrGjs2i/TxY3I1D8V1z7aUiyKw2lnWxGp8YhUSnIz1tGbEl0JnMVxX1Ri2NJ8hjNJlNKWXZ3V+6l2VIZbqEzoTNJP9PiJXkKzW6caF9vkqQpXDstjOV2dNq/GzS7PEnymFGbcm9TYgeZHauI3I4+KeSzcEfPgyr5q5qfpOha+Ylingl/E6+lnVTivjSU1uno5ufSGX8UauyrNsy54iYF+bjGtZWoESguNRBSnt+SqG38zpVkHEuiRqCBeqd8jOn7rb8qmp7y7RSxzfsS0vXRs+Y5EhXj2sSy5rqsl+Zr9hKlwqfj3IFlM4Xmi7X36B13FZMYKtPTXLvKI06kRnf0CjMzzRYtSa6ipakqcVkaSlthcDavlOQqI/bDdsH5jMp6Pfqfshc3IW5cJBpM3iYmmYymM2v0Xy/HUCl7/s5JXI2w0d1+NxpIXkIDxOe1tLGUZxM0O4lS4QG3jH0eri/S9yVKxbXn2epzbmAZLeqpe1FF12JJqM5quYNQ3JWG0qbryJofSFRMKl4kUSPwLwCafRmJqxTaWUJSyTMBpmzb0cS/soi7EM0mV0U6ujXHSZSKa08TyEckqhKuvwLfbaTseUZ/uhtYRpu9o7MkuxhqoKuaXRnRYKFeCxaB0qfqiGcPiUqRtIkkUSO4dtGXPXVCfj/l5sNKPrevxJ8kUaXo+a3fdn0NOt4TJDqFa1ekowd+68kSpUI233fTSFQlXF9537q79mpgGS1sR7fmKHGzbb278gDqLHs1O+1UXrMrLesdKe5KQ+kLdXSG4ke+tZaoFFQf73btSGdLtArVzQdo1v4v2UzB6eXjCE4eXBenS9S2te6O+7jxlM+6RKtQ2XeynWyGUJ182PUjUSko7eiLRWro6IybJkzXMSsSPcLVL3v8L4Z21nu7BMW4fqp1dGt2uxFFtZgdffz16jh0f+Ul7ipB6Qt3dEY7vny9KtEpXLuCiq8XqW7PUuLHSpKm0OyKSJKHaPEZ+mlqu6aOzpDtiW7aIqJjeou4CHHjK3V0Pt93I4pqvb3j/qGTBJpdliRJjHz5UsiWKuNkza6M6BT6zeIukzW79GAtbVVRuT8rriuh+Bu5L8CF6nXkbjnt2EWQ/Wmuvatx1538xZuWJqneLvNQMc+Ejs8LtLQpWfM9MR+BynGYmoZlvRvYhj6/Ih03+qKOdHxo8wyJKkRv10H3pXSZk1ikXtv7M0mSwrXLu7Ry7SU4PLClfpeDqkuqHID5oDVKqGZZ81KpbgDmQ6FbH6HKotPQq6WqAZgv1BifpzVSaDJRvd4qVQxAM+j53jFaY4WqS6oWgGbBq6xoDRYqL6lSAJqL1nChYgp880GpRgCaj9aIofHiu5yk+gBYHLR7hyFN+mOGACwUwZgFCLa6pIoA2DzQ9eeVWmPfisq6bxyATUNgzYe0xr8VJFUAwNZh0tVkF0X8II3sMgBbG3dlzEUXde4LZdcAABr83Czf/ql1oCZrYM0zZRcAAGXp+UsP61tznda55qnAer4UEQAwLYKOeSF1uPRKH9PRSdqrlgAAc6TfPeBXAt8cSqf/b6Br5c/T2QCv8cXroPFqHaEo/AoK/0/uxH3fHM2P20pyAEDTCBfHs95rqMPWPbOfGr+aBgAwewbtpUfRLDz27Z91ix/DlewBANOiv7ryCOpwZ7sdcA7i0/5VKRYAoA7oOvoopbM1RObTUkwAQBWoEz1D71yN1Fek2ACAIvQ7rccpHWkhFBRY7x2ALU/gm59rHWjRxC+wl10CAETQdfjIu5kXXUHOK48A2FLw6ipaR9ks4pf8y64CsPWI3wK5BYQFH8GWpNdefqLWITa1rNeT3Qdg80ON/viRTrBFxF82SjUAsHmh6/Hc1+puBUl1ALD5oE7+Sa3Rb1VJtQCweaCGfZLb0CF0drCJ6FvvSK2RQ0NJNQGwuKx1Vx6iNW5onwLrrUt1AbCYaA0bGhV19sOlygBYLLQGDWVrT3f5N6TqAFgMAt/7sNaYofGS6gOg+Wx0V+6iNWIoX3QKf61UIwDNRmvAUHGtd5f+l1QlAM0ksOYzWuOFykmqE4BmojVaqIKsOU6qFIBm0bfeOWqjhSpJqhWAZqE1Vqi6AutdIFULQDOgU83LtMYKTSapXgCagdZIoRpkzVFSxQDMF7o2/5LaSKFaJNUMwHzRGidUp1q/J1UNwHzYSgs8zk9mTaobgPlADfHS0YYJ1S2pbgDmg9YoofoVdMwRUuUAzJZg1fyy1iih+hX45mapdgBmCzW+f9ca5VYT1wPJ8uIRtP2Kad0hKNUOwGzRGmNRiYuYwPeu0Ow07T3qkDtLshjNbqjWX4lJKajjvk/3NxR16tsGbe/XxVxlo7v9brRf39LSV5G4rcSNxx58T83neFWrO9AMqO2d7B5TiSqH66SMxEUMv5BQs9MUrK48XJKFXHfM0t01u1Bt7+/ErBR9az6m+iOVfTXyeqf1h5qf0rLe08VlacbWUY7EBVgwaLJ6k3MsA4kqTn915RGOk1ISNzGL0tH5MVwxKUUdtwhPcu/7JB2dJW7AAlFPR/e91zpOSkncxMyyowd22ay1vf3HiTr0FzR/4mIEmm2fSmn+X79jDpKgmP7qgb+q+aoicVkavY7MxfvkXUT7cMOoTaxPiSuwINTU0cPGkXRSSuImZpYdXbUrphPFRQx17jcodvwF3X+JyUSXOK7EZWm0OpKoEQbtpUe5tuPsQTOpa0ZPOigtcROzCB1d+/JNs0vJem9XwytKsi2NVkcbO3feXqJHoOOx6tpjiavFAh1dsysgSR4TdFqeZjdN7bbegyT7UpTt6IxrX/TLQL65p2/Nl/lSgBe7pP+n0/+WRBeC2sNzKc+vkJ/d7IPOnM6ghnuYRBdiYL0/HuZtrmY/5O9sOhN9hkQX4truyi+Rj5eTvkrpb2RfVJ4zg/byk8QkE/6lI/Bbv8PtlcUvM5GokLVd5t5UnhNI75GgTAb+8rPCfLk+qRy0P/9JeqlEq+R1dL7MJJv/oPzXuP/R51PWuua3JHqI46C0xE3Mpp3Ra1bPb/2FZF2KOjo6dz6JUqFOoH6vkRRfFoi5CjW63BdxUjk+LOYqFD9yNjIq80oxV+lZ8xw9nSPrHSlJRqBO+fy0rdktUdwJb07GSfAIVM5zk3YZCsjB7SRJTFZHz7vRjdL9JHTAaAZlJG5iFqGj00F9p7iI6XXMH6m2U1LP946RrEtRR0cf+K0/kKgRXNtxooZkJVkKivu+a5slGlS+LclSuB1orKz3JUmWQrUdJ2veK0lT9Pzlv0nacRvn8GRYpDBBAuqM+2l248T5SfIQt6NT/nt67eUdybAxGs7+SkQphU4SaDbZSj+2ObOOThIXI9DB3qnZ1y5r3iFZlqJsR6d4Os1N20vUCK5dQmdTY7tSCd/g01pJHtLvtB6v2WVJkqWgvH6u2dLMegE1cv3GJeX0l075n63ajtHGEdvvKMlj3I5OA8slVI4LU2EiSRISXi4oNnniTiwuQkY6uvW+k9zOE509/nbtHX0SynZ02uEPUBy/xlmReQ/9132R6EDtFTcq4f0F43+mmkiU/9jT1iy0OpKoEYK295euLV/HSXQKivupa+teizKuDR2D2yQqhGboq1wb9/sIqtd/kbhTJSiGBv+nJNMO1XqJRMdoHV6iUuyLN6dJUAyVvZVMH8qa70l0jNLRMxdokSQhWjyV+xae5cUkhL8n2Bdvfi7BMW5Hd0V1/rxBd+XX1jtmuxZP+36WWpgykrLUQtmOnofqJyGqwGvENJP19o77U4PgL05UH5Vlzccki1JodUTl+zE1oB9ForAbXZtI4iYFBd5uxJZmZokewbWV4BA3jvbzBxI1QpHvSmh/TpaoEVxbymunRMX0fPPn8lGFzwRcPxIVM9LRE6JO1hazFFTuN47YW+8ciVYJO6RCdkc3nxSTFK4dt4/Ryiop8V0Ls+7okagiPiJJMhlYc4iWtrKs9wlxXYqxdZSjte6O+4ibFNxgXFuJUqH6+lnaft834NTAR05p99gDHijRY1mzSw9200qUCnWyz6XtzeUSVYq0j+IdfdwvJ5q9RJVG6+h0DH4o0SOQffr5Dmv66OgJUSMdezpd5ZovS3wwxG0pqnV0c/H439rNT5L21IFuov9BlqiR3Ub/E/be+8VVOEsn4/bJrPGppZip0OD3TiWtWgaWlDNlL65Ugo5ZJpsTqeF/l471LW7aSGIeo3Z05RQ/iWs/6HhPkKjSaB1dolQCf/lYxz6ovaNrNlka+MuPlGQhZTs6HazzqQGdp4p/n9T8FFHGt7gMNep1NU1JUSN9g7gsRaWObr0bJLmKmqaEaF/OEFchFPZx1yYla54mpinIz7dV+xISVzEb3f3uRO3hcs02S5I0Ruvo/ESjRI/At2a79hJVibIdnfuKY19/R6fO1/yf14rr45JVzN6jd9xVsSstGjCeLy5LodWRRMXwdalrQ4098waTUduSst5HxVUMNc7DVNuE3EsJSnONZldG4iqEBo4PaTZ5kuQxWkeXKJVee/mJZezzcDs6bY9dvAQdvZJGV27V7cqJOnqpO8witDrSTstdG5ZEjaDYvot9FpW4UaH2MPamFzELGZ6hpeM3utt+QctTFdmKq8z7/Ekf5zshk2shuDYSHFO2o/PDVGXs81Bm9LG3wKKjVxBV8r9LdjGaXVnxvoq7UhTu6Mrjx1l349Gg88OkHR3DsT89ViG8jTWRRyKvW8SEvwE/zo2XqNK4frL2SRsQJCqmbEdnXHva/7+XqNLU0tHpIKe+WCkr8R2zKB2dynnFRnflLlpcUlTJh0p2MZpdWYmr0hTt6AwdW+fbcT3foGNe6Nrt7q78pkTXCnXmkfUBJCrEjaPLgldJVClcP3zno0SloEua01xbiYqpo6MXScPwba3yMaaujn6mE1hK4jtmUTq6uAihinybZsMSkxjuAJpdWYm70pTp6IxrS9et6oIbrh1LolSib9dlMwXV583UDtT76XvWWxqXjxvH4lNhiVZhG74LTTZDXB98RiFRKVw7lkTFVOno2uCZly5qh7IZU1NHNy9wAktJfMcsQkfnmVxcpAifUPKXj6V96PBvuhKcgmak6zSfZSXuSjNpR2dJVApqTFazJZ2afKyVT/+pfvbE8dZ7u0SF9FfN7yfSbgQd728litIuPSwZF0miQ3hfNBuq9x/0/eXfFTMeaB5N5Uj9Zi9RIclwLX7cgC0mMVU6OuOmSegV/GsA2/B3BTTZ+ql4650eOhBq6ejU6O/gBJaS+I5pekenShu5xbAoA7/1p5rPsqIyVPoNnSnb0RnXngb3WyUqBXWmL7u2RcRl4vRFLoVccSMOM0/Qb5sXa7Z5og4T/5JBp+QnaDaaqAxjn0Cr2tEZN11Rcb8UF/V09DAiHVhKoYMEizCjh7LeU8VNIWgGuJfqp4LGPT2WR5WOTh175P5z/plQolNQvZRc4tpcLElDyqTn7xAk2Qjk50gtzTjxa8UkeYhm40q7P1ySx0zS0Rk3bZ748kaShtTW0alz7nUiCit0kIB8FV7u2T0wjGbHGljzTDGJ0ezKiBrauvbzmQvNdO/W0leVuK3E9d397+H6y+vojJuGJVEj8ECk2btyn7KKWO+uPECzT4rayb+J+Viokef+tk7H8XAxH4HifqylGWq4DLYbHiZMQMf/qDybPGh/R+99d0Q2XxTzFFQHI0uWS5QK+emo9hRR4AH/TS5rLqNG8QEePUNZ8yHS1arthAorfUGgujiUZwiqizbPsoP28p9IVCGGlzutl4TpO96L+nb5sRJVCjo+B/MXXKEfv/WywG89WaIKwZ162M5bL9MW/pwVfH8830ot3wWtkp47yRleabQGCU1D5jypcgBmj94oobrV22UeKlUOwOyhRjjR+u5QMUl1AzA/tIYJ1Sl9oQAAZoreOKG6JNUMwHyhGecZWgOFJlfgrK0GwFzRGik0ubKWcQJgLgTW/IPWUKHJJNULQHPQGipUXdpdfQDMnaBjVrQGC1WTVCsAzUNrsFB59XYddF+pUgCaR/ZbH6CiCqx3rVQnAM2lb71LtAYMFZNUIwDNR2vAUL6CjjlCqhCA5lPk2WIorSBn3W0AGknfmn/VGjSkS6oNgMVDa9DQqKS6AFhctIYN7ROuy8GmQWvgEMu8UqoIgMWH3yKpN/Stq8A3b5PqAWDzEHRX7qc1+C0pa74r1QLA5uPGYw++p9rwt5AC3/uwVAcAmxutA2wF9ax5jlQBAFsDrSNsZgXt5SfJrgOwtQh88w2tU2w2bRyx/Y6yywBsTfj1tlrn2Ayi6/HzZTcBAAx1ilu0zrKoCuyykV0DACTpW/M0rdMslKx3iewOAGAc1GEW7w0w1lwmxQcAlIFmx3eqnapBCqy5ab294/5SZABAVej6Pfc90bMWdfCrtHe1AwAmhBdNpA72Oa3jzUKU962DjvcEKQ4AYNoEqysPp+vij2kdsk7R2cSP6BLiqZItAGCeBB2zLNf0gdtZy8mcRTP3Cza2bbuduAYAgPHsPeqQOw/a3qP5zSs0gLw5sN6ZdJZwBf3/mT7Q1C/Ka53y/jZ9/hTpeP4Zc+AvP1KKCAAAAABm0F56VL/t/R1dOZxOuiE5mS6SaNK/mr/26PnLf7PHHvBA2T0AAABgcxGsmv3o6rojV7vqpLh5Zc7rt82L8cZ2AAAAC0Xgt55Mk/dn9ckNisU3MljvQKk2AAAAYL4M/OVnBb65Up20oOKy3jl8MiTVCgAAAEyXnt/6C7oCP1+dlKDaFFjvA71d5qFS7QAAAMBkrNmlB8/iOTdovOgk6uTd3ZV7yWEBAAAA8uHHxQJrvqZNLFAj9C4szwMAAECFn/sOfPM+ZfKAGiw68XqrHEIAAABblY3ufnfqW++j2kQBLZYC39vb91svkUMLAABgK8DPhfd9c7k2MUCLL5rcL9zTXf4NOdwAAAA2G/2O9yJtAoA2p3jp2v7qyiPk8AMAAFh0At+cog340NZRYE1bmgMAAIBFo++bT2qDO7R1xY+/SfMAAADQdPDcOJQnfoudNBcAAABNg66+3qIN3hCUKby0HgAAmgNdbR2iDtYQVFDr7aXHSHMCAAAwaza6K3cIfPMTbYCGoLIKrDlDmhYAAIBZ0ffNCdqgDEGTqme9JWlmAAAApklgvdu0gRiC6pO5WJobAACAuuFXl+qDLwRNR71O6wBpfgAAAOqgb71PaAMuBE1bgW+60gwBAABUJeiu3E8bZCFotjLnSpMEAABQln6n9Th9cIWgOcia3dI0AQAAFGWPPeCB6qAKQXPWtd2VX5JmCgAAYByBbw7VBlIIaopwsxwAAOQQtJefpA2gENQ4dVqPk2YLAAAgSb9jDlIHTghqoqx3gzRdAAAAEX1rDlYHTQhqtMxgo7vtF6QZAwDA1gY3wEGLrMCab0tTBgCArQ1dnX9XGyghaGFkvbdLcwYAgK1J3zdHqwMkBC2cWn8lzRoAALYWvV3mofrACEGLKV7ZUJo3AABsHQLrfV0bFCFoURX43meleQMAwNaAJvPnawMiBC28rNkpzRwAADY3e4865M78uI86GE5T1jsyfNY9QwPr/TENxtepaSdUz5rnaHlG6rWXn0gnOeta2hydqPmbmnzvbCf/SgqsuYn+nxh0zPJGd+UO0jTGwl9nB745jNrOe6iurnV9NkbWfEyKPHM2utvvFvjeF6l+v0b1dF4VUfrzaT++QnV8Jm1/mj6fRH3nVQNrnrm7u/KbkhUAYE5Qvzx6+A230n+p7/MYwGOBmE+XwF8+NjUAzkhrbW9/KYLKxs6dt6eK+JGWdlIFqysPl2xUrjtm6e5kF7jpctX2/k5czASerNRyFBA1tC/0/NZvi6vaoBOxv9fym6fW7NKDpXgzpXI7qiA6ufpG3y4/VrIGAMwI6ntv0vpkQgGPBWI+XagwP1EKMHVhQp+cShO6Ne+W5FOHzlDPVcswa83pMbZZTuhJ0cna86QIAIAp05gJnb+2UzKfiTChTw7Vz8lqORTxTwgb3f3uJEmnDuV5oluGeYnq6ZaZnSEnmNeEHmnQ9n5digIAmBKNmdDpyuV0JfOZaKtO6HTw/11NO1WZNck+l4Hf+lOyP0v3E1793UQ6g9rO0yXJCGR3qptu3uL7JqR4M6NIO6K6vErMM9l79I679vylh/Gz9XRi9hHNT5Z2W+9B4gYAMAUaMaHze6SpIDcrmc9EW3VCn+R376rim/wk+0x6vvlzLW0R0XH6YuC3fof90ET/cs1m7rLeR8MdnSGFJnRq49zWJUlhru/ufw/Nnyvyf6EkAQBMgUZM6FSIw5SMZyZM6LMRHedrJOtMhld/evpNI+v1+IkO2eWZMM0JneGfUCj9LZrflDqtx0uSqcB38PK+zvInHY2rX/b4X+RyzPo4u2wcsf2OXA4ujwTNlaheuFwStCXh9jlsp/XecV73hM4X22E5y4wLlMlrnUxnKkzosxE/UpbXMHq7DrqvlnazqddpHSC7PBOKtKNJJnQmsOYzmt+kgo45QswrIz/FnEb53arlkSnrXTKw3rPFzcT02t6fUZ39m5rXGPE9JPxzBT8OK64mYm2XuTft22sqjFE3kk7kk2hxNTF8wkbH5j00tpR+zJfq5IeU9oR+94BfEXeloTbxPM13LCqX1sbXuysPoLRv5ZNtJd2pYlaKqJ0q/nJFx/LCnu8dU3aFyaoTenhRXfLdKVTGN6onB7TT/EyrmmgWwoQ+O9GAviLZZ8KPsGlpN5No8DpcdncmzGRC973Pa35Tst5TxbwUVF+7VH8TaOAvP0vcF2atu+M+VJYLNH/VZa7nm4Ili0KsdVceQhPQ13R/lXV2mVf+bmzbdrvALhuaDL6h+JpYVM/vl6wK0/OX/0bzFclt4zQGHqXZJcWTpJiPhf1S+/4XzcekojL8V5ETnfwJ3Qz4qptt1ztme5UTL03r7aXHhAVgKJOLNaNZCRP6bKWe1WUQ+K0n08D1Tc3PQouuqGQXZ8K0J3S6Mnuc5jMla3aXfUc8lan0FXBZ8foXkt1YaIKZ2pLUeeNABH/DoKWvV+YsyW4s4c8s1vuO7qNGWfM0yTKX/Al9+LNfmZ/28iZ0vgChMYoXxFLT1ynOZ9yCW7kTuvW+Omh7j1bjJhS1hTPDQtDGT93IWSp3QqdBiL9FoMHlfPo/sgJPFfHZNStvha1pTujD/VHSzkCD9vKfSDFKwRM81d9cv9GpRXQmL7s0E6Y5oQ+/ZtV9JsXHTpLkQvVzoObDFQ1gN9OA/2q62n5k8mSBP/fayzton4o+Tnm8JFWhNlfoq1PKj+8j+DjpFbQPL6d0JwxPnM3lSbuk1rrmtySbsZC/c7T0o+InQ8wzBt2VX5OkIbxNg+7h5Oe/9XRp8bcRknQsdAyy1w+hvCjPD4RfH3PfDdtK6ykU5lPcl9Q0mgqMZ0zehE76VNlHpGn/3ibuR6B6Lr2+RXiBYs17w/ZBorr4R2o3n6X/41e5LLCGRe6EXlDcjsO+pcTl6Hie0MtPWDUqb0KfJ9Oc0CdlOHAoeRcUNeyrJn0L2Y3HHnxPanwd6gw/0/JorswnZRdmQuEJna66eDLkiX1EHN7dfje+uuFBkewLXz3TsS68wAwNXEdqPpIifzftsQc8UJLkQu3jcM1PSpSvmKcIVs0vU/rb1DQiKs+tRX+L5tUCabA8JUxbcH1/ai/Xu3mOqvhrenldAN3HPtHx3cPHXZKMhfb/6jCNNZ8r8rNaEj5xKLJ/RU58ClyhZ05SdIx/TPv8T3TF/RfhVTeNTfzmzz3W+9/iPoYf3yTbvZqfEdGJS9lHNoePhQ7rVHy8SqLGUmVCp/24Iu/po0F76VHFxlhzMSb0MTR8Qj9PzbuKrPlPajAtcV0ZnnDI1+vUPJokumqTIs+Eyu1ocl2avHLOgwcyxUdKNAB9WMxLEb6TQfGXlDZpDB+r9fZo9pGGE0Xr9yRJrdBgfomWZ1J8U5eYF4aPC/XhnHdnmNPEfKrwtyl6/vtEx+AtYp5JgSt0R+ZifuxSkhdid3flXrqvEV0qSSaiTP8pNaFXWKmT2uL4b3es1+OJYfYvZEkIE3o1ap3QEwrPfGlSLvpVZBY96y1p/huiSnfOVmUOE/ql/dWVR0j2haF0Fzl+0rLmuuhRmrIaDsQ5V4IZV0IU/hrV3hGdlK5T+10t+nV1HvxUgJZPUjSId6vWCaX9oOYzEvdF/oZCilMLnC9//c/faPC9A3wixHeEU1l+rpUhlvU+IS4yKTOh0xVwpWWJKS3/pKL6jES+PyPmM6XohD6w5hBJUgruH5q/hAIuxJVKxMxU5Dd0athvpM76frI/qRaFv6GY9+YticmNn+ybOqHPcn30s4P28pMk61JQ+3qf4m++st47pXgzoXI7KinqI5Xv3udHFot9rTdNZf8UQu3I6mnGiwb3LxRZUEmD8vwPzedM1TEHSXEKwf2Uyn1K7slTWRX4VqvohF718UX++l3zl5YZzOs5e6r3/AndmuPEvDT9tnmx6nOfeEKf381ZrNwJfecmvcu9KS8sqSRzbplnmrk+dD/zEV/FSdFmQqF2ZE2fJp83k97AA0NadELrm9cXGqSt91XJthRFvnadgT4lxcmE6qKjpCssOmm5gLRL3GUSXkhYc5XmY6bqtB4nRVLh+qD9+aGatk7VNKFTnX5OzEvDaw9oPlOaw0qQEdxX1TIlNMmbLQuMozShW/MhJWJm2rIT+pweW6tbdGxOll0aS5NOYKjjHSbFmglF2hG38SK/15Ht+K/Fh7pRzAvT65g/UvykZc1uqrsruax1i09WaGLypTi58Nfc4VeQ+mIkxWS9S8atakfxuXekh+XnG0yd/ZlY1lzNfrN+n6e4tlaePNHxu5nqme/ovpR8fJP28Rza/jqF53zlXtOEPsHiRkXuwyDlnhROi9wJndrqJKsGFp3Q/0GJmJkwoS++qA29VXYrE9rf47S081DR547rovCEXvCu5mInR+Z6MS8EL5NKadZ0XyIa/MW8kVA7fEE4SWllHytztLhIUaSP1rXiXBnoOHxVK8uIrPeaIjfshc+059x4WNuE7ptDxbw0fOc7nXyMfeKBpd0ZPwtyJ3QaA3gsEPPSFJrQ533zEib0+Yjq9LNUhsu0uLKihvxB2a1MaNA8QUs7c9FVmRRpZtQ9oTNc55qfpPhKbNwVqAtNhl/Q/KRkzevEvPH07fJj6Xh/Qt0PR9rKdYXu/rbmJr7hT5JMHcov9wKszDcdTN9vPUXzk1JtE3rx9RA0yMe7XJ+uhu0+ewGYadGICZ2hweQKJXImwoQ+e7nP7PJqXdQYK71xjwaYq8XNWOo6eZhU1JZyH7+pm2lM6AwNXIWWZF1v77i/JBkLryugpR+RNd+TJBNBE8lLeNKVzVz45jba5+fLZmGCTstT9yMp650u5ikoPPetgVSm2/qr5vclSWXChV/a5sWyqUL55d/l3THLYp4LP+ut+RhRQyZ0puh8UKWtuJAPXgzohj3d5d+QoEwaNKGbtymRMxEm9NmJJt8zJPtMhgtveG+kK+rxSwJb869Fn/2l9lXpDuWpyHoHSrFmxrQmdIYG7xdq/lzxkpOSZCz8mJSWXpX1zhn4rT+QpLkMF1Qxr6R9TX29W+QrUnewJB//xmuZS/RYaFD+QDKtJvKf+S0Txb1eS6OJ8trF66xL0lwGHe8JtC/pdfiteYdEjzDsmwlbRVTe94n5WOj4fVRLr6pBEzrDk6zmXxPVWafoN1V8hzz5PpLqcGQFvryfL9w2qmg2E3qhG2KmJEzo0xdN5IVX0qobyv8VbnnmppquLMsyzQmdoYGk4Al56ymSJBfyWfqRLUrzc6rjyzgt7c8Xub5pgiv0KNy4ZZhpgC20XCrl9UPK88v0/0zavtSNH6e8kwry2dLS5Yn63lV0EnNuWCe85LRvrtHsRpTxjcFwZTfFXhHXA0+y/A3Feqf1h/IGsn/m8UCzH6uGTegM1WWlC9HwGAxvBjyT2un59H/8sq9JjflGifw2Y0JnuMEpBlMXJvTZierx83UvVJFFuHZ10eUZZyQayF4gxZsp057QmSKDaagCa1JH8JUmpTl7xMeUNPJTUHflfppdnaJx7ydlrqip375a8zMd6c/l8+/DFDf+BsYSorZ3Iem5VBfZd7o3cEKPIL+nuvlMS/yNWNbTKI2a0As94zcFYUKfj+is9CPuCyTqgCaMA6d1vCYSv4u5xDKOdTKLCZ0J2t7/0XyPqOO9SJIUhtK9dsRPDaL9PrnIfpPdKg2Yle7z0ETt/za+chX3peFxi3xM4Q1w5tyi9xXwcdR9lJAsdJLrq8ETegQ/Elfnic4+mU/yUyCSTSaNmtAZ/kpIMZqqer731/w+V+4grvhrIrnTdDpvhLNm57i8uWNRp11X044RpflHft+t5pfFeVJd599RPEuFb5NqvazMkqH8exMvY8gnB6rPJmnGb1hLws+eyuB/KQ0OF4+Kwq33pTpOOPiGqNBnuAa5m89QVJZrqe0fJUlKE6ya/cjPK6nc34/rt5jO5kGp7MsyXMIbuWgiokn+QiUPVTTYXkP7/X4+4RQ3tRGuN9/x/pb69BnlTjrCt8CdxC8kEVeVGL6sZPnY4fHV8kmK8rTeq9Z2mXtL8hC+y5/q9LKhD0fhzyjeP4lpJnRC+ZeZPljWfI9v/BPzqcIrH/INhtLvlHrI1EU8MfPP0OKqMHzSSempTyj7Hj737319kufQxx4j8S+mQ3gVG9kpCNpU4g4uzRwAALYGdJbxFm1AhKBFFV05taV5AwDA1oIu4etd2B+C5qdaXqMIAAALCT9vpwyMELRQCqx3G7+jXZo1AABsTQLfO1kbJCFoYTSjG3AAAKDxDO+oUwZKCGq46Oq81HrWAACw6aGBcfrv2oWgGhX45vXSfAEAACShQbL84ioQNAcFvvdZabYAAABceMGLvm8G2gAKQY2RNddJkwUAADAOGjB/oA6kEDRnBdZ8U5opAACAItDAebU2oELQ/GROk+YJAACgDOGavOrACkGzVeB7HWmWAAAAqlDgzTIQNFVVeYECAAAAhfCtR8pAC0HTFq9mKM0QAABAXQTWfFsbdCGobgW++Q9pdgAAAKZB4Htv1AZgCKpNWMoVAABmw8a2bbcLrPdjdTCGoOo6UZoYAACAWRL4rScrgzIEldZ6e+kx0qwAAADMi8A379MGaQjKlTWvk2YEAACgKQS+d6E6aEPQiMwJ0mwAAAA0kd6ug+5LV+xX6oM4tNUVWO9MaSoAAAAWgaC7cj+sCQ9Foon86xvd7XeT5gEAAGDR4De48TPF2iAPbX4FvrcqTQEAAMBmga7YX60N+tDmE03kz5XDDgAAYLPS67QO0CYBaOF1abBq9pPDDAAAYCtBV+0vVSYGaFFkze6g0/LkcAIAAADbeK34t6qTBtQ8WfNqOWwAAACAzm7rPahvvdPViQSan6z3cjlEAAAAQDk2uit3CTrmiMA3P1EnGWh6st45A+s9Ww4FAAAAUB+7uyu/2bfmHeoEBE2kwHo/o7o9TqoaAAAAmB299vIOuno/RZugoPGiCfzavm9eOWh7vy7VCQAAADSD645Zujs/A00T1qmkIDmBbXFdSjppYM0zN47YfkepLgAAAGCxWOuuPCTomBf2rfmyM9FtKtHJzB666v4kXX0fvt7ecX/ZfQAAAGBzIzfdrdBkeDzfBEb/G39VLy+/+XjP947hnxw2du68vewOAAAAALK4vrv/PQZt79E0eT6RJ9HAmjcMH6szZ9Hk+g266v8uTbDfp6vjH8nv0mu0zScGmm5kG7alz9+nz98h+/PI5xfo/2kU9lry99KBNYes2aUHb3T3u5MUAwAAwJZn27b/Af93JubaMkhQAAAAAElFTkSuQmCC",
    x: 0.38,
    y: 5.15,
    w: 1,
    h: .38,
  });

  slide.addText("© 2020, HFS Research Ltd", {
    x: 4.2,
    y: 5.4,
    w: 1.5,
    fontFace: chartFontFace,
    fontSize: 6,
    color: "7f7f7f",
    align: "center",
  });

};

const ExportChart: React.FC<ExportChartProps> = () => {
  const {
    chart: { chartData, questionData, baseCount },
  } = useSelector((state: RootState) => state);

  const generateChart = async () => {
    let pptxGenJsObj = new pptxgen();
    let fileName: string = "HFS- " + questionData?.labelText;
    let mainQuestionText: string = questionData?.labelText || "";
    let baseText: string = `Base: Total = ${baseCount}`;
    let questionText: string = questionData?.questionText || "";
    let chartFontFace: string = "Calibri";
    let vericalColumnSlide = pptxGenJsObj.addSlide();
    // let vericalStackedSlide = pptxGenJsObj.addSlide();
    let horizontalColumnSlide = pptxGenJsObj.addSlide();
    // let horizontalStackedSlide = pptxGenJsObj.addSlide();
    let tableSlide = pptxGenJsObj.addSlide();

    let slideConfig: ISlideConfig = {
      mainQuestionText,
      baseText,
      questionText,
      chartFontFace,
    };
    let seriesData: any[] = [];

    if (
      questionData?.type === QuestionType.SINGLE ||
      questionData?.type === QuestionType.RANK ||
      questionData?.type === QuestionType.MULTI
    ) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI
    ) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    } else {
      console.log("under development");
    }

    let colors;
    if (seriesData.length > 1) {
      colors = [...colorArr];
    } else {
      colors = [primaryBarColor];
    }

    const commonChartProperties = {
      x: 0.3,
      y: 0.7,
      w: 9.4,
      h: 4,
      chartColors: colors,
      dataLabelFontFace: chartFontFace,
      dataLabelFontSize: 4,
      dataLabelFontBold: true,
      showValue: true,
      catAxisLabelColor: "191919",
      catAxisLabelFontFace: chartFontFace,
      catAxisLabelFontSize: 6,
      catAxisLineShow: false,
      valAxisLabelFontSize: 6,
      valAxisLabelColor: "191919",
      valAxisLineShow: false,
      valAxisLabelFontFace: chartFontFace,
      legendFontSize: 6,
      showLegend: true,
      showTitle: false,
      dataLabelFormatCode: "0%;;;,##.##%",
    };

    setDefaultSlideProperties(vericalColumnSlide, pptxGenJsObj, slideConfig);
    setDefaultSlideProperties(horizontalColumnSlide, pptxGenJsObj, slideConfig);
    // setDefaultSlideProperties(vericalStackedSlide, pptxGenJsObj, slideConfig);
    // setDefaultSlideProperties(
    //   horizontalStackedSlide,
    //   pptxGenJsObj,
    //   slideConfig
    // );
    setDefaultSlideProperties(tableSlide, pptxGenJsObj, slideConfig);

    vericalColumnSlide.addChart(
      pptxGenJsObj.ChartType.bar,
      seriesData,

      {
        ...commonChartProperties,
        dataLabelColor: "000000",
        barDir: "col",
        barGrouping: "clustered",
        legendPos: "b",
        dataBorder: { pt: .5, color: "0000ffff" },
        //catGridLine: { color: 'FFFFFF', style: 'solid', size: .1 },
        valGridLine: { color: 'E6E6E6', style: 'solid', size: .5 },
      }
    );

    horizontalColumnSlide.addChart(pptxGenJsObj.ChartType.bar, seriesData, {
      ...commonChartProperties, 
      dataLabelColor: "000000",
      barDir: "bar",
      barGrouping: "clustered",      
      legendPos: "b",
      //@ts-ignore
      dataLabelPosition: "l",
      //@ts-ignore
      catAxisOrientation: "maxMin",
      
      dataBorder: { pt: .5, color: "0000ffff" },
      //catGridLine: { color: 'FFFFFF', style: 'solid', size: .1 },
      valGridLine: { color: 'E6E6E6', style: 'solid', size: .5 },

    });

    const row = tableChartDataGen(seriesData);

    tableSlide.addTable(row, {
      x: 0.3,
      y: 0.6,
      h: 3,
      w: 9.4,
      border: { type: "solid" },
      //catGridLine: { color: 'FFFFFF', style: 'solid', size: .1 },
      //valGridLine: { color: 'E6E6E6', style: 'solid', size: .5 },
      fontSize: 6,
      //@ts-ignore
      pt:.5,
    });

    await pptxGenJsObj.writeFile({ fileName: fileName + ".pptx" });
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      renderChild: () => <PptIcon />,
      onClick: generateChart,
    },
    {
      renderChild: () => <PdfIcon />,
      disabled: true,
    },
  ];

  return (
    <ButtonGroup
      groupTitle="Export"
      buttonConfig={buttonConfig}
      className="export-chart-group"
    />
  );
};

export default ExportChart;
