# Tanzania mobile-money phone prefixes

This note documents the Tanzanian mobile-number allocation ranges shown by the built-in phone-transfer channels. It is informational guidance for people entering a destination number. A prefix does not verify that a wallet exists, identify the current operator after number porting, or confirm that a payment settled.

## Ranges used by the channels

The values below use the domestic format, including the leading `0`. Each range includes every final digit from `0` through `9`.

### M-Pesa (Vodacom)

```text
0740 0741 0742 0743 0744 0745 0746 0747 0748 0749
0750 0751 0752 0753 0754 0755 0756 0757 0758 0759
0760 0761 0762 0763 0764 0765 0766 0767 0768 0769
0790 0791 0792 0793 0794 0795 0796 0797 0798 0799
```

### Mixx by Yas (formerly Tigo Pesa)

```text
0650 0651 0652 0653 0654 0655 0656 0657 0658 0659
0670 0671 0672 0673 0674 0675 0676 0677 0678 0679
0710 0711 0712 0713 0714 0715 0716 0717 0718 0719
0770 0771 0772 0773 0774 0775 0776 0777 0778 0779
```

### Airtel Money

```text
0680 0681 0682 0683 0684 0685 0686 0687 0688 0689
0690 0691 0692 0693 0694 0695 0696 0697 0698 0699
0780 0781 0782 0783 0784 0785 0786 0787 0788 0789
```

### HaloPesa (Halotel)

```text
0610 0611 0612 0613 0614 0615 0616 0617 0618 0619
```

TCRA lists `062` as not operational in its July 2025 numbering plan, so this channel does not advertise `0620`–`0629` as an active range.

## How numbers are normalized

The channels accept Tanzanian mobile numbers and normalize them to E.164 with country code `+255`. For example, domestic `0740…` becomes `+255740…`. The channel help text shows the ranges associated with each service, but validation checks only that the input is a structurally valid Tanzanian mobile number.

This is deliberate: Tanzania supports mobile-number portability, so a subscriber can keep a number after changing operators. The prefix is a useful clue, not proof of which wallet currently receives the payment. The user should select the intended wallet and confirm the recipient and transaction in that wallet. This package only describes and validates payment details; it does not make or verify payments.

## Source

- Tanzania Communications Regulatory Authority (TCRA), [National Numbering and Signaling Point Codes Plans, July 2025](https://tcra.go.tz/download/sw-1751634705-National_Numbering_and_Signaling_Point_Code_Plans_edition_of_2025.pdf). The plan assigns `061` to Viettel Tanzania, `065`, `067`, `071`, and `077` to Honora Tanzania, `068`, `069`, and `078` to Airtel Tanzania, and `074`, `075`, `076`, and `079` to Vodacom Tanzania. It marks `062` not operational.
- TCRA, [Frequently asked questions on numbering](https://www.tcra.go.tz/faq/frequent-asked-questions-on-numbering), including its description of mobile-number portability.
- Yas Tanzania, [Tigo is now Yas](https://yas.co.tz/tigo-is-now-yas-your-guide-to-the-new-brand-2/), which identifies Tigo Pesa as rebranded to Mixx by Yas.
